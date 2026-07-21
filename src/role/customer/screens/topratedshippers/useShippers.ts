import { useState, useEffect, useCallback, useMemo } from 'react';
import customerService from '../../../../api/services/customerService';
 
export const useShippers = () => {
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
            
            const res = await customerService.getTopRatedShippers();
            if (res.success) {
                setShippers(res.data);
            }
        } catch (e) {
            console.error("Error fetching shippers:", e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { fetchShippers(); }, [fetchShippers]);

    // Advanced Multi-Filter Logic
    const filteredData = useMemo(() => {
        return shippers.filter(s => {
            // 1. Search (Name or Region)
            const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 s.region.toLowerCase().includes(searchQuery.toLowerCase());
            
            // 2. Rating (Number comparison)
            const minRating = activeFilters.rating === 'All' ? 0 : parseFloat(activeFilters.rating.replace('+', ''));
            const matchesRating = s.rating >= minRating;

            // 3. Category matches (Exact string matching or 'All')
            // Note: API fields must match these keys (transportType, experienceLevel, etc.)
            const matchesTransport = activeFilters.transport === 'All' ? true : s.transportType === activeFilters.transport;
            const matchesExp = activeFilters.experience === 'All' ? true : s.experienceLevel === activeFilters.experience;
            const matchesResponse = activeFilters.response === 'All' ? true : s.responseTime === activeFilters.response;
            const matchesPrice = activeFilters.price === 'Any Price' ? true : s.priceTier === activeFilters.price;

            return matchesSearch && matchesRating && matchesTransport && matchesExp && matchesResponse && matchesPrice;
        });
    }, [shippers, searchQuery, activeFilters]);

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
        refresh: () => fetchShippers(true),
    };
};