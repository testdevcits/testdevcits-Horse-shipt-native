import AppHeader from './common/AppHeader';
import SectionHeader from './common/SectionHeader';
import AppCalendarModal from './common/AppCalendarModal';
import PhotoSourceSheet from './common/PhotoSourceSheet';
import AppSelect from './common/AppSelect';
import MapModal from './common/MapModal';
import ChatlistCard from './cards/ChatlistCard';
import Button from './common/Button/AppButton';
import Input from './common/Input/Input';
import ConfirmationModal from './common/ConfirmationModal';
import AppText from './common/AppText';
import { FloatingButton } from './common/FloatingButton';
import { AppLoader } from './common/AppLoader';
import { EmptyState } from './common/EmptyState';
import ErrorView from './common/ErrorView';
import SearchBarCompt from './common/SearchBarCompt';
import TripCard from './cards/TripCard';
import HorseCard from './cards/HorseCard';
import ShipmentCard from './cards/ShipmentCard';
import PaymentCard from './cards/PaymentCard';
import ReviewCard from './cards/ReviewCard';
import ShipperCard from './cards/ShipperCard';
import TruckDriverCard from './cards/TruckDriverCard';
import CountryCodePicker, {
  COUNTRIES,
} from './common/CountryCodePicker/CountryCodePicker';
import ShipmentLocationModal from './common/ShipmentLocationModal';
import LocationPermissionModal from './common/LocationPermissionModal';
import LazyFallback from './common/LazyFallback';

// Skeletons
import HomeSkeleton, { HomeSkelaton } from './common/skeletons/HomeSkeleton';
import ShipperHomeSkeleton from './common/skeletons/ShipperHomeSkeleton';
import ShipmentsSkeleton from './common/skeletons/ShipmentsSkeleton';
import MyHorsesSkeleton, {
  MyHorsesSkelatons,
} from './common/skeletons/MyHorsesSkeleton';
import ShippersListSkeleton from './common/skeletons/ShippersListSkeleton';
import ShipperDetailSkeleton from './common/skeletons/ShipperDetailSkeleton';
import ShipmentDetailSkeleton from './common/skeletons/ShipmentDetailSkeleton';
import PaymentsSkeleton from './common/skeletons/PaymentsSkeleton';
import ReviewsSkeleton from './common/skeletons/ReviewsSkeleton';
import ChatListSkeleton from './common/skeletons/ChatListSkeleton';
import ChatDetailsSkeleton from './common/skeletons/ChatDetailsSkeleton';
import ProfileSkeleton from './common/skeletons/ProfileSkeleton';
import SettingsSkeleton from './common/skeletons/SettingsSkeleton';
import Skeleton from './common/skeletons/Skeleton';
import SkeletonCard from './common/skeletons/SkeletonCard';
import SkeletonCircle from './common/skeletons/SkeletonCircle';
import SkeletonText from './common/skeletons/SkeletonText';

// Driver
import DriverHeader from './common/DriverHeader';

export {
  AppHeader,
  SectionHeader,
  AppCalendarModal,
  PhotoSourceSheet,
  AppSelect,
  MapModal,
  ShipmentLocationModal,
  LocationPermissionModal,
  ChatlistCard,
  Button,
  Input,
  ConfirmationModal,
  AppText,
  FloatingButton,
  ShipperCard,
  TruckDriverCard,
  AppLoader,
  EmptyState,
  ErrorView,
  SearchBarCompt,
  TripCard,
  HorseCard,
  ShipmentCard,
  PaymentCard,
  ReviewCard,
  CountryCodePicker,
  COUNTRIES,
  LazyFallback,

  // Skeletons
  HomeSkeleton,
  HomeSkelaton,
  ShipperHomeSkeleton,
  ShipmentsSkeleton,
  MyHorsesSkeleton,
  MyHorsesSkelatons,
  ShippersListSkeleton,
  ShipperDetailSkeleton,
  ShipmentDetailSkeleton,
  PaymentsSkeleton,
  ReviewsSkeleton,
  ChatListSkeleton,
  ChatDetailsSkeleton,
  ProfileSkeleton,
  SettingsSkeleton,
  Skeleton,
  SkeletonCard,
  SkeletonCircle,
  SkeletonText,

  //Driver
  DriverHeader,
};

export type { AppSelectRef } from './common/AppSelect';
