import { useState, useEffect, useCallback, useMemo } from 'react';
import customerService from '../../../../api/services/customerService';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { fetchWishlistThunk, toggleWishlistThunk } from '../../../../redux/slices/wishlistSlice';

export const useShippers = () => {
    const dispatch = useAppDispatch();
    const { wishlistIds } = useAppSelector(state => state.wishlist);
    const [shippers, setShippers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Comprehensive filter state
    const [activeFilters, setActiveFilters] = useState({
        quick: 'All',
        rating: 'All',
        transport: 'All',
        experience: 'All',
        response: 'All',
        price: 'Any Price'
    });

    const fetchShippers = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);
            
            dispatch(fetchWishlistThunk(isRefresh));

            const [topRes, wishRes]: [any, any] = await Promise.all([
                customerService.getTopRatedShippers().catch(() => null),
                customerService.getWishlist().catch(() => null),
            ]);

            const topList = topRes?.data || (topRes as any)?.shippers || (topRes as any)?.topRatedShippers || [];
            const wishList = wishRes?.data || (wishRes as any)?.wishlist || [];

            const combinedMap = new Map<string, any>();

            if (Array.isArray(topList)) {
                topList.forEach((s: any) => {
                    const id = s?.id || s?._id;
                    if (id) {
                        combinedMap.set(String(id), s);
                    }
                });
            }

            if (Array.isArray(wishList)) {
                wishList.forEach((s: any) => {
                    const id = s?.id || s?._id;
                    if (id) {
                        const existing = combinedMap.get(String(id)) || {};
                        combinedMap.set(String(id), {
                            ...existing,
                            ...s,
                            isWishlisted: true,
                            isFavorite: true,
                        });
                    }
                });
            }

            setShippers(Array.from(combinedMap.values()));
        } catch (e) {
            console.error("Error fetching shippers:", e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [dispatch]);

    useEffect(() => { fetchShippers(); }, [fetchShippers]);

    // Map shippers with real-time wishlist state from Redux
    const shippersWithFavState = useMemo(() => {
        const wishSet = new Set(wishlistIds);
        return shippers.map(s => {
            const sId = s.id || s._id;
            const isFav = wishSet.has(sId) || s?.isWishlisted === true;
            const img = typeof s?.profileImage === 'string' 
                ? s.profileImage 
                : (s?.profileImage?.url || s?.avatar || s?.image || '');
            const shipperName = s?.name || s?.shipperName || `${s?.firstName || ''} ${s?.lastName || ''}`.trim() || 'Professional Shipper';
            const locationRegion = s?.region || s?.location || s?.address || s?.city || 'Region N/A';

            return {
                ...s,
                _id: s._id || s.id,
                id: s.id || s._id,
                profileImage: img,
                name: shipperName,
                region: locationRegion,
                rating: Number(s?.rating) || 5,
                reviewCount: Number(s?.reviewCount) || 0,
                isFavorite: isFav,
                isWishlisted: isFav,
            };
        });
    }, [shippers, wishlistIds]);

    const handleToggleWishlist = useCallback((shipperItem: any) => {
        const targetId = shipperItem?.id || shipperItem?._id;
        if (targetId) {
            dispatch(toggleWishlistThunk({ shipperId: targetId, shipperItem }));
        }
    }, [dispatch]);

    // Advanced Multi-Filter Logic
    const filteredData = useMemo(() => {
        return shippersWithFavState.filter(s => {
            // 1. Search (Name or Region)
            const nameStr = String(s?.name || '').toLowerCase();
            const regionStr = String(s?.region || '').toLowerCase();
            const qStr = searchQuery.trim().toLowerCase();

            const matchesSearch = !qStr || nameStr.includes(qStr) || regionStr.includes(qStr);

            // 2. Quick filter
            let matchesQuick = true;
            if (activeFilters.quick === 'Verified') {
                matchesQuick = Boolean(s?.isVerified || s?.verified || (s?.rating || 0) >= 4);
            } else if (activeFilters.quick === 'Top Rated') {
                matchesQuick = (Number(s?.rating) || 0) >= 4;
            } else if (activeFilters.quick === 'Nearest') {
                matchesQuick = true;
            }

            // 3. Rating (Number comparison)
            const minRating = activeFilters.rating === 'All' ? 0 : parseFloat(activeFilters.rating.replace('+', ''));
            const matchesRating = (Number(s?.rating) || 0) >= minRating;

            // 4. Category matches (If field exists check match, otherwise pass through)
            const matchesTransport = activeFilters.transport === 'All' || !s?.transportType ? true : s?.transportType === activeFilters.transport;
            const matchesExp = activeFilters.experience === 'All' || !s?.experienceLevel ? true : s?.experienceLevel === activeFilters.experience;
            const matchesResponse = activeFilters.response === 'All' || !s?.responseTime ? true : s?.responseTime === activeFilters.response;
            const matchesPrice = activeFilters.price === 'Any Price' || !s?.priceTier ? true : s?.priceTier === activeFilters.price;

            return matchesSearch && matchesQuick && matchesRating && matchesTransport && matchesExp && matchesResponse && matchesPrice;
        });
    }, [shippersWithFavState, searchQuery, activeFilters]);

    const updateFilter = (category: string, value: string) => {
        setActiveFilters(prev => ({ ...prev, [category]: value }));
    };

    const resetFilters = () => {
        setActiveFilters({ 
            quick: 'All', 
            rating: 'All', 
            transport: 'All', 
            experience: 'All', 
            response: 'All', 
            price: 'Any Price' 
        });
    };

    return {
        shippers: filteredData,
        loading,
        refreshing,
        searchQuery,
        setSearchQuery,
        activeFilters,
        updateFilter,
        resetFilters,
        toggleWishlist: handleToggleWishlist,
        refresh: () => fetchShippers(true),
    };
};