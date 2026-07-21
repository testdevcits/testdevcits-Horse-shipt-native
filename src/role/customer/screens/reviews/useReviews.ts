import { useState, useEffect, useCallback } from 'react';
import customerService from '../../../../api/services/customerService';

export const useReviews = () => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // For the "Write a Review" interaction
    const [rating, setRating] = useState(0);
    const [selectedChips, setSelectedChips] = useState<string[]>([]);

    const fetchReviews = useCallback(async () => {
        try {
            setLoading(true);
            const res = await customerService.getReceivedReviews();
            if (res.success) setReviews(res.data);
        } catch (err: any) {
            setError(err.message || "Failed to load reviews");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchReviews(); }, [fetchReviews]);

    return { reviews, loading, error, rating, setRating, selectedChips, setSelectedChips, fetchReviews };
};