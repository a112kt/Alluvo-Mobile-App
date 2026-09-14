import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { LinearGradient } from "expo-linear-gradient";
import { SvgXml } from "react-native-svg";

interface AvailableSize {
  id: number;
  size: string;
  quantity: number;
}

interface ColorOption {
  id: number;
  name: string;
  hexCode: string;
  availableSizes: AvailableSize[];
}

interface AddToCartDialogProps {
  visible: boolean;
  product: any;
  onClose: () => void;
  onAddToCart: (productId: number, color: string, size: string, quantity: number) => void;
}

const closeSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1B2351" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
const minusSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1B2351" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
const plusSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1B2351" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;

const AddToCartDialog = ({
  visible,
  product,
  onClose,
  onAddToCart,
}: AddToCartDialogProps) => {
  const colors: ColorOption[] = product?.availableColors ?? [];
  const productId = product?.id || product?.productId;

  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);
  const [selectedSize, setSelectedSize] = useState<AvailableSize | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (visible && colors.length > 0) {
      setSelectedColor(colors[0]);
      setSelectedSize(colors[0].availableSizes[0] || null);
      setQuantity(1);
    }
  }, [visible, colors]);

  useEffect(() => {
    if (selectedColor) {
      if (selectedColor.availableSizes.length > 0) {
        setSelectedSize(selectedColor.availableSizes[0]);
        setQuantity(1);
      } else {
        setSelectedSize(null);
      }
    }
  }, [selectedColor]);

  const handleIncrease = () => {
    if (selectedSize && quantity < selectedSize.quantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAdd = () => {
    if (selectedColor && selectedSize && quantity > 0 && productId) {
      onAddToCart(productId, selectedColor.name, selectedSize.size, quantity);
      onClose();
    }
  };

  if (!visible || !product) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <SvgXml xml={closeSvg} width={20} height={20} />
          </TouchableOpacity>

          <Text style={styles.title}>Add to Cart</Text>
          <Text style={styles.productName} numberOfLines={1}>
            {product?.productName || product?.name}
          </Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollArea}
          >
            {/* Color Selection */}
            <Text style={styles.sectionLabel}>Select Color</Text>
            <View style={styles.colorRow}>
              {colors.map((color) => (
                <TouchableOpacity
                  key={color.id}
                  onPress={() => setSelectedColor(color)}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color.hexCode },
                    selectedColor?.id === color.id && styles.colorSelected,
                  ]}
                />
              ))}
            </View>

            {/* Size Selection */}
            {selectedColor && selectedColor.availableSizes.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>Select Size</Text>
                <View style={styles.sizeRow}>
                  {selectedColor.availableSizes.map((size) => {
                    const isOutOfStock = size.quantity === 0;
                    return (
                      <TouchableOpacity
                        key={size.id}
                        onPress={() => {
                          if (!isOutOfStock) {
                            setSelectedSize(size);
                            setQuantity(1);
                          }
                        }}
                        style={[
                          styles.sizeChip,
                          selectedSize?.id === size.id && styles.sizeChipSelected,
                          isOutOfStock && styles.sizeChipDisabled,
                        ]}
                      >
                        <Text
                          style={[
                            styles.sizeText,
                            selectedSize?.id === size.id && styles.sizeTextSelected,
                            isOutOfStock && styles.sizeTextDisabled,
                          ]}
                        >
                          {size.size}
                        </Text>
                        {isOutOfStock && (
                          <Text style={styles.outOfStockLabel}>Out</Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            )}

            {selectedSize && (
              <Text style={styles.availableText}>
                Available: {selectedSize.quantity} units
              </Text>
            )}

            {/* Quantity */}
            <Text style={styles.sectionLabel}>Quantity</Text>
            <View style={styles.quantityRow}>
              <TouchableOpacity
                onPress={handleDecrease}
                style={[styles.qtyBtn, quantity <= 1 && styles.qtyBtnDisabled]}
                disabled={quantity <= 1}
              >
                <SvgXml xml={minusSvg} width={20} height={20} />
              </TouchableOpacity>
              <View style={styles.qtyValue}>
                <Text style={styles.qtyText}>{quantity}</Text>
              </View>
              <TouchableOpacity
                onPress={handleIncrease}
                style={[
                  styles.qtyBtn,
                  selectedSize && quantity >= selectedSize.quantity && styles.qtyBtnDisabled,
                ]}
                disabled={selectedSize ? quantity >= selectedSize.quantity : true}
              >
                <SvgXml xml={plusSvg} width={20} height={20} />
              </TouchableOpacity>
            </View>
          </ScrollView>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleAdd}
            disabled={!selectedSize || quantity === 0}
            style={styles.addBtnWrapper}
          >
            <LinearGradient
              colors={
                !selectedSize || quantity === 0
                  ? ["#B0B0B0", "#D0D0D0"]
                  : ["#1B2351", "#47C0D2"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.addBtnGradient}
            >
              <Text style={styles.addBtnText}>ADD TO CART</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AddToCartDialog;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  dialog: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
    paddingHorizontal: scale(24),
    paddingTop: scale(20),
    paddingBottom: scale(34),
    maxHeight: "85%",
  },
  closeBtn: {
    alignSelf: "flex-end",
    padding: scale(4),
  },
  title: {
    fontSize: scale(22),
    fontWeight: "700",
    color: "#1B2351",
    textAlign: "center",
    marginBottom: scale(4),
  },
  productName: {
    fontSize: scale(13),
    color: "#666",
    textAlign: "center",
    marginBottom: scale(20),
  },
  scrollArea: {
    maxHeight: verticalScale(320),
  },
  sectionLabel: {
    fontSize: scale(14),
    fontWeight: "600",
    color: "#1B2351",
    marginBottom: scale(10),
    marginTop: scale(12),
  },
  colorRow: {
    flexDirection: "row",
    gap: scale(12),
    flexWrap: "wrap",
  },
  colorCircle: {
    width: scale(34),
    height: scale(34),
    borderRadius: scale(17),
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorSelected: {
    borderColor: "#1B2351",
    transform: [{ scale: 1.15 }],
  },
  sizeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scale(8),
  },
  sizeChip: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    borderRadius: scale(8),
    borderWidth: 1.5,
    borderColor: "#ddd",
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  sizeChipSelected: {
    borderColor: "#1B2351",
    backgroundColor: "#1B2351",
  },
  sizeChipDisabled: {
    borderColor: "#eee",
    backgroundColor: "#fafafa",
    opacity: 0.5,
  },
  sizeText: {
    fontSize: scale(13),
    fontWeight: "600",
    color: "#555",
  },
  sizeTextSelected: {
    color: "#fff",
  },
  sizeTextDisabled: {
    color: "#ccc",
  },
  outOfStockLabel: {
    fontSize: scale(8),
    color: "#EF4444",
    fontWeight: "600",
  },
  availableText: {
    fontSize: scale(11),
    color: "#47C0D2",
    marginTop: scale(6),
    fontWeight: "500",
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(20),
    marginTop: scale(4),
  },
  qtyBtn: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: "rgba(71,192,210,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyBtnDisabled: {
    opacity: 0.4,
  },
  qtyValue: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: {
    fontSize: scale(18),
    fontWeight: "700",
    color: "#1B2351",
  },
  addBtnWrapper: {
    marginTop: scale(20),
    borderRadius: scale(12),
    height: scale(48),
    overflow: "hidden",
  },
  addBtnGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addBtnText: {
    color: "#FFFFFF",
    fontSize: scale(15),
    fontWeight: "700",
  },
});
