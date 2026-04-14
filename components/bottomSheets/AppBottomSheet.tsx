import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { forwardRef, ReactNode } from 'react';
import { AppText } from '../ui/app-text';

interface AppBottomSheetProps {
  snapPoints: (string | number)[];
  title?: string;
  children: ReactNode;
}

const AppBottomSheet = forwardRef<BottomSheet, AppBottomSheetProps>(
  ({ snapPoints, title, children }, ref) => {
    return (
      <BottomSheet ref={ref} index={-1} snapPoints={snapPoints} enablePanDownToClose>
        <BottomSheetView style={{ padding: 20 }}>
          {title && (
            <AppText className='text-2xl font-bold text-center mb-4'>
              {title}
            </AppText>
          )}
          {children}
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

AppBottomSheet.displayName = 'AppBottomSheet';
export default AppBottomSheet;