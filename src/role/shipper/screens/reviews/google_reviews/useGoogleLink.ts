import { Linking } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import shipperService from '../../../../../api/services/shipperService';
import { showErrorToast, showSuccessToast } from '../../../../../utils/toast';
import Clipboard from '@react-native-clipboard/clipboard';

const useGoogleLink = () => {
  const [googleReviewLink, setGoogleReviewLink] = useState('');
  const [savedLink, setSavedLink] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const isConnected = Boolean(savedLink && savedLink.trim().length > 0);

  const fetchReviewLink = useCallback(async () => {
    setInitialLoading(true);
    try {
      const res = await shipperService.getGoogleReviewLink();
      if (res?.success) {
        const link =
          res?.googleReviewLink ||
          res?.data?.googleReviewLink ||
          (typeof res?.data === 'string' ? res?.data : '') ||
          '';
        if (typeof link === 'string') {
          setGoogleReviewLink(link);
          setSavedLink(link);
        }
      }
    } catch (err: any) {
      console.error('Get Google Review Link Error:', err);
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviewLink();
  }, [fetchReviewLink]);

  const handleInputChange = (text: string) => {
    setGoogleReviewLink(text);
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async () => {
    let trimmed = googleReviewLink.trim();

    if (!trimmed) {
      setError('Please enter a valid Google Review URL.');
      return;
    }

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      trimmed = `https://${trimmed}`;
    }

    const lower = trimmed.toLowerCase();
    if (
      !lower.includes('google.com') &&
      !lower.includes('goo.gl') &&
      !lower.includes('maps') &&
      !lower.includes('g.page')
    ) {
      setError(
        'Please make sure this is a valid Google Maps or Google Business link.',
      );
      showErrorToast(
        'Invalid Link',
        'Please make sure this is a valid Google Maps or Google Business link.',
      );
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await shipperService.updateGoogleReviewLink(trimmed);
      if (res?.success || res?.data) {
        setSavedLink(trimmed);
        setGoogleReviewLink(trimmed);
        showSuccessToast(
          'Success',
          res?.message ||
            (isConnected
              ? 'Google Review link updated successfully.'
              : 'Google Review link added successfully.'),
        );
      } else {
        const msg = res?.message || 'Failed to update Google Review link.';
        setError(msg);
        showErrorToast('Error', msg);
      }
    } catch (err: any) {
      console.error('Update Google Review Link Error:', err);
      const msg =
        err?.response?.data?.message || 'Failed to update Google Review link.';
      setError(msg);
      showErrorToast('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenLink = () => {
    const url = savedLink || googleReviewLink;
    if (url) {
      const targetUrl =
        url.startsWith('http://') || url.startsWith('https://')
          ? url
          : `https://${url}`;
      Linking.openURL(targetUrl).catch(() => {
        showErrorToast('Error', 'Unable to open this link on your device.');
      });
    }
  };

  const handleCopyLink = () => {
    const url = savedLink || googleReviewLink;
    if (url) {
      Clipboard.setString(url);
      showSuccessToast('Copied', 'Google review link copied to clipboard.');
    }
  };
  return {
    loading,
    initialLoading,
    handleInputChange,
    handleSubmit,
    handleOpenLink,
    handleCopyLink,
    isConnected,
    savedLink,
    googleReviewLink,
    error,
  };
};

export default useGoogleLink;
