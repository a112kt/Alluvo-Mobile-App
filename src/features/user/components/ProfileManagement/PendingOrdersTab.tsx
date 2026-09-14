import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React from 'react'
import { scale, verticalScale } from 'react-native-size-matters'
import { lightColors } from '../../../../../theme'
import OrderCard from './OrderCard'
import { useTranslation } from 'react-i18next'
import { useOrdersContext } from './MyOrders'
import { useNavigation } from '@react-navigation/native'
import { getProductImageUri } from '../../../../utils/imageUtils'

const PendingOrdersTab = () => {
  const { t } = useTranslation();
  const { orders, isLoading } = useOrdersContext();
  const navigation = useNavigation<any>();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="small" color={lightColors.primary} />
      </View>
    );
  }

  // Filter orders that are not completed, delivered, cancelled, or blocked
  const pendingOrders = orders.filter((order: any) => {
    const status = (order.status || 'pending').toLowerCase();
    return !['completed', 'delivered', 'done', 'blocked', 'cancelled', 'rejected'].includes(status);
  });

  return (
    <View style={styles.container}>
      {pendingOrders.length > 0 ? (
        pendingOrders.map((order: any) => {
          const items = order.orderItems || order.items || [];
          const itemCount = items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
          const itemImages = items
            .map((item: any) => {
              const uri = getProductImageUri(item);
              return uri ? { uri } : null;
            })
            .filter(Boolean)
            .slice(0, 2);
          
          return (
            <View key={order.id || order.orderNumber}>
              <OrderCard
                orderId={`Order #${order.orderNumber || order.id}`}
                itemCount={itemCount}
                deliveryType={order.deliveryMethod || "Standard Delivery"}
                status={order.status || "Pending"}
                onTrack={() => {
                  navigation.navigate("OrderDetails", { orderId: order.id });
                }}
                images={itemImages.length > 0 ? itemImages : undefined}
              />
            </View>
          );
        })
      ) : (
        <Text style={styles.NoPending}>{t("noPendingOrders")}</Text>
      )}
    </View>
  )
}

export default PendingOrdersTab

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
  center: {
    padding: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  NoPending:{
    fontSize: scale(14),
    fontFamily: 'Poppins-Regular',
    color: lightColors.subtitle,
    textAlign: "left",
  }
})
