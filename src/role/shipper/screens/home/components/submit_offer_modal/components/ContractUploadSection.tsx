import React, { memo } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AppText } from '../../../../../../../components';
import AppIcon from '../../../../../../../components/app_icon/AppIcon';
import { COLORS } from '../../../../../../../constants';
import styles from '../styles.SubmitOffer';

interface ContractUploadSectionProps {
  contractFile: any;
  isPicking: boolean;
  onChooseFile: () => void;
  onRemoveContract: () => void;
}

const ContractUploadSection: React.FC<ContractUploadSectionProps> = ({
  contractFile,
  isPicking,
  onChooseFile,
  onRemoveContract,
}) => {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionTitleRow}>
        <AppIcon name="FileText" size={18} color={COLORS.brandBrown} />
        <AppText style={styles.sectionTitle}>Shipper Contract</AppText>
      </View>

      <View style={styles.dashedFileContainer}>
        <View style={styles.fileTextCol}>
          <AppText style={styles.fileNameText} numberOfLines={1}>
            {contractFile?.fileName || 'No file chosen'}
          </AppText>
          <AppText style={styles.fileCaptionText}>
            Optional PDF or image. Customers can review it before accepting the quote.
          </AppText>
        </View>

        <TouchableOpacity
          style={[styles.chooseFileBtn, isPicking && { opacity: 0.7 }]}
          onPress={onChooseFile}
          activeOpacity={0.8}
          disabled={isPicking}
        >
          {isPicking ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <AppText style={styles.chooseFileBtnText}>Choose File</AppText>
          )}
        </TouchableOpacity>
      </View>

      {contractFile && (
        <TouchableOpacity
          style={styles.removeContractBtn}
          onPress={onRemoveContract}
        >
          <AppText style={styles.removeContractText}>
            Remove contract
          </AppText>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default memo(ContractUploadSection);
