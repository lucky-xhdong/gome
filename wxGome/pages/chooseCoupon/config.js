
export function COUPON_TIPS(max = 1,name = '',price = 0) {
    return {
        0: '不明确的原因',
        1: '所结算商品中没有符合条件的商品',
        2: '同一订单内最多使用' + max + '张' + name,
        3: '同一商品最多使用' + max + '张' + name,
        4: '商品中有参加满返促销活动，不能同时使用',
        5: '差' + price + '元可用该券',
        6: '券规则数据有误',
        7: '店铺商品已参加店铺促销活动，不能同时使用购物劵',
        8: '団抢商品不支持使用优惠券',
        9: '已使用冲突店铺券，不能同时使用平台券',
        10: '为开通支付密码（只适用于红券）',
        11: '已经抵扣全部国美自营商品运费',
        12: '所结算商品中未产生国美自营运费'
    }
}

export const COUPON_LABELS = {
    FEE: '运费券',
    BLUE: '蓝券',
    RED: '红券',
    GOME: '美券',
    GOU_WU: '购物券',
    SHOP: '店铺券',
    S_W: '实物',
    PRODUCT: '商品券',
    UNKNOWN: '未知的券类型'
};

export const COUPON_URL = {
    FEE: 'FeeCoupon',
    BLUE: 'BlueCoupon',
    SHOP: 'ShopCoupon',
    PRODUCT: 'ShopCoupon',
    GOU_WU: 'ShopCoupon'
};