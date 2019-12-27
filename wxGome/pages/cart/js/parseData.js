/**
 * Created by CAOYI on 2017/3/31.
 * 将数据中 parse数据部分抽取出来
 */
"use strict";
const config = require('../../../common/config');
const Promise            = require('../../../lib/es6-promise').Promise;
const util   = require("./util");
function parseCarts(data,page,Data) {
    let groupsItems     = [],
        _meiDianIdArray = [];
    function isNull(d) {
        if (!d || !util.isArray(d) || d.length < 1) {
            return true;
        }
        return false;
    }

    if (isNull(data)) {
        return data;
    }

     /**
     * 处理组head 数据
     * @param item
     * @returns {*}
     * @private
     */
    function _parseCartsGroupsHeads(item) {
        let _heads = [];

        /**
         * 设置 _tilte 和_laber属性
         * @param _head
         * @returns {*}
         * @private
         */
        function __setHeadHtml(_head, index) {
            //TODO 最终处理组head 数据
            if (_head.type == 'TZ') {
                _head._label = groupsItems[0].vProductName;
                _head._title = '套装';
            } else {
                _head._title = config.labels[_head.type];
                _head._label = _head.label;
            }
            _head._showDisabled = groupsItems[0].showDisabled;
            _head._reserveStatus = groupsItems[0].reserveStatus;
            _head._state = config.groupStatus[groupsItems[0].state] || config.groupStatus['default'];
            //selected

            return _head;
        }

        function __parseHead(heads) {
            if (isNull(heads)) {
                return heads;
            }
            _heads    = heads;
            let items = heads.map(function (head, index) {
                return __setHeadHtml(head, index);
            });
            //将选中的优惠放在第一位
            for (let i = 0, len = items.length; i < len; i++) {
                if (items[i].selected && i > 0) {
                    items = util.arrChangeTop(heads, i);
                    return items;
                }
            }
            return items;
        }

        function __parseHeads(items) {
            if (isNull(items)) {
                return items;
            }
            return items.map(function (heads) {
                return __parseHead(heads);
            });
        }

        if (isNull(item) || isNull(item[0])) {
            return item;
        }
        return __parseHeads(item);

    }

    function _parseCartsGroupsProducts(products, heads) {
        if (isNull(products)) {
            return products;
        }

        /**
         * head 头促销类型
         * @param type
         * @returns {*|string}
         * @private
         */
        function _setLabelPriceType(type) {
            return config.labels[type] || '';
        }

        function _setLabelProperty(prop) {
            if (isNull(prop)) {
                return prop || [];
            }
            let label = '';
            for (let i = 0, len = prop.length; i < len; i++) {
                if (label) {
                    label += ';'
                }
                label += prop[i].labelVal;
            }
            return label;
        }

        function _setLabelGifts(gifts) {
            if (isNull(gifts)) {
                return gifts || [];
            }
            return gifts.map(function (gift) {
                // return `[赠品]${gift.itemName}X${gift.quantity}`;
                return gift;
            })
        }

        function _setLabelService(ser) {
            if (!ser ||  !ser.showBaseGroupVOList ||  ser.showBaseGroupVOList.length<1) {
                return ser || [];
            }
            let serviceItem = ser.showBaseGroupVOList;
            let _labelServices = [];
            for(let i=0,len=serviceItem.length; i<len; i++){
                if(!serviceItem[i].incrementServiceItems && serviceItem[i].incrementServiceItems.length<1){
                    continue;
                }
                for(let j=0, items = serviceItem[i].incrementServiceItems; j<items.length; j++){
                    if(items[j].selected){
                        _labelServices.push(label(serviceItem[i],items[j]));
                    }
                }
            }
            function label(serviceItem,s){
                let textNormal  = `[${serviceItem.childGroupName}]${s.displayName}${s.numOfYear}年 ¥${util.parsePrice(s.price)}x${s.quantity}`,
                    textSpecial = `[${serviceItem.childGroupName}]特惠${s.displayName}${s.numOfYear}年 ¥${util.parsePrice(s.price)}x${s.quantity}`;
                return s.warrantyType == "SPECIAL" ? textSpecial : textNormal;
            }
            return _labelServices;

        }

        /**
         * 判断product状态 先通过 onTheRoad与reserveStatus 判断，再通过type判断
         * @param type
         * @param onTheRoad 在途
         * @param reserveStatus
         *         YY-预约|YYWYY-预约未预约
         *         QGQ-预约待开抢，抢购未开始|QGQWYY-抢购前未预约|QG-抢购中|QGCF-抢购过重复购买
         * @returns {*}
         * @private
         */
        function _setState(type, onTheRoad, reserveStatus) {
            if (reserveStatus) {
                //reserveStatus
                //YY-预约|YYWYY-预约未预约
                //QGQ-抢购前(预约待开抢)|QGQWYY-抢购前未预约|QG-抢购中|QGWYY-抢购期间未预约|QGCF-重复购买
                return config.productStatus[reserveStatus] || config.productStatus.default;
            }
            if (onTheRoad) {
                return config.productStatus['onTheRoad'];//onTheRoad 在途
            }
            return Object.assign({},config.productStatus[type] || config.productStatus.default);
        }

        function _setNumRange(limit) {
            let num = [];
            if (limit < 1) {
                return [1];
            }
            for (let i = 0, len = limit; i < len; i++) {
                num.push(i + 1);
            }
            return num;
        }
        return products.map(function (product) {
            //带“_”数据是在此处添加的
            product._priceType      = _setLabelPriceType(product.priceType);//价格类型
            product._priceTypeClass = config.labelsCss[product.priceType] || "";//价格类型css
            product._labelProperty  = _setLabelProperty(product.salesPropertyVOs);
            product._labelGifts     = _setLabelGifts(product.commerceItemVOs);
            product._labelService   = _setLabelService(product.incrementServiceInfo);
            product._numRange       = _setNumRange(product.limitNum);
            //预售中
            if (!product.reserveStatus && product.commerceItemStatus && product.commerceItemStatus == 'presell') {
                product._state          = _setState(product.inventoryState, product.onTheRoad, product.commerceItemStatus);
            } else {
                product._state          = _setState(product.inventoryState, product.onTheRoad, product.reserveStatus);
            }
            product._stateGroup     = config.groupStatus[product.state] || config.groupStatus['default'];
            product._price          = util.parsePrice(product.salePrice);
            product._imgUrl         = util.dealUrl(product.itemImageURL);
            if (!product._isSuitClass) {//_isSuitClass添加默认
                product._isSuitClass = "";
            }
            if (product.serviceTagFlag && util.isArray(product.serviceTagFlag)) {
                product._serviceTagFlag = product.serviceTagFlag[0];
            }
            if (product.meidianId) _meiDianIdArray.push(product.meidianId);
            //对于套装 样式特殊处理
            if (heads && heads[0] && heads[0][0] && heads[0][0].type == 'TZ' && heads[0][0]._state.label == '下架') {
                //if 套装 整体下架，那么套装子产品也下架
//                product._state.cssClass = 'product-type--off';
            } else { //补丁,微信小程序 对于空class变量的处理，如果为空，则是上面传的值；
                product._state.cssClass = config.productStatus[product._state.type].cssClass;
            }
            return product;
        });
    }

    function _parsePomotionSummary(summary) {
        if (!summary) {
            return summary;
        }
        summary._price = util.parsePrice(summary.subAmount);
        return summary;
    }

    function _parseCartsGroups(groups) {
        if (isNull(groups)) {
            return groups;
        }

        function __hasSuit(obj) {
            if (obj.type == "TZ") {
                return true;
            }
            return false;
        }

        /**
         * 对套装特殊处理
         * 对于product 添加属性
         *     _isSuit，是否是套装
         *     _isSuitClass 套装的css class
         *     _isSuit 是否是group中最后一个
         * @param group
         * @param isSuit
         * @returns {*}
         * @private
         */
        function __setIsSuit(group, isSuit) {
            let len = group.length;
            return Array.prototype.map.call(group, function (product, index) {
                (index == len - 1) ? product._isLast = true : product._isLast = false;
                product._isSuit = isSuit;
                product._length = len;
                isSuit ? product._isSuitClass = 'check-box-suit' : {};
                return product;
            });
        }

        function _dealMatch(group) {
            let reObj    = {price: 0};
            let _isMatch = __hasMatch(group.promotionHeads, reObj) || false;// 是否是搭配购物
            let products = group.commerceItemsGroup;
            if (_isMatch) {
                __dealMatchOnProducts(group, reObj.price);
            }

            /**
             * 是否是搭配够
             * @param heads
             * @returns {*}
             * @private
             */
            function __hasMatch(heads, reObj) {
                let _is = false;
                if (!heads || heads.length < 1) {
                    return false;
                }
                for (let i = 0, len = heads.length; i < len; i++) {
                    let head = heads[i];
                    if (isNull(head)) {
                        continue;
                    }
                    if (head[0].type == 'DPG') {
                        if (reObj) reObj.price = util.parsePrice(head[0].postC);//得到搭配购优惠价
                        return true;
                    }
                }
                return _is;
            }

            /**
             * 处理搭配够product
             *    对商品添加
             *      _isMatch  表示 是否是搭配够
             *      _isNotMatchMain 表示 是否是主品
             * @param group
             * @returns {*}
             * @private
             */
            function __dealMatchOnProducts(group, savePrice) {
                let products = group.commerceItemsGroup || [];
                if (isNull(products)) {
                    return group;
                }
                products = products.map(function (product, index) {
                    product._isMatch = true;
                    if (index == 0) {
                        product._isNotMatchMain = false;
                        (savePrice > 0) ? product._savePrice = savePrice : '';//搭配购 优惠价格
                        return product;
                    }
                    product._isNotMatchMain = true;
                    return product;
                })
            }
        }

        return groups.map(function (group) {
            //对套装特殊处理 start
            let _isSuit = false;//是否是套装标示
            if (group.promotionHeads && group.promotionHeads[0] && group.promotionHeads[0][0]) {
                _isSuit                  = __hasSuit(group.promotionHeads[0][0]);
                group.commerceItemsGroup = __setIsSuit(group.commerceItemsGroup, _isSuit);
            }
            //对套装特殊处理 end
            //非套装处理 start
            if(!group.promotionHeads || group.promotionHeads == null){
                group.commerceItemsGroup = __setIsSuit(group.commerceItemsGroup, false);
            }
            //非套装处理 end
            _dealMatch(group);//搭配够处理

            groupsItems              = group.commerceItemsGroup;
            group.promotionHeads     = _parseCartsGroupsHeads(group.promotionHeads);
            group.commerceItemsGroup = _parseCartsGroupsProducts(group.commerceItemsGroup, group.promotionHeads);
            group.pomotionSummary    = _parsePomotionSummary(group.pomotionSummary);

            return group;
        });
    }
    data.map(function getCartsGroups(item) {
        item.commerceItemsGroups = _parseCartsGroups(item.commerceItemsGroups);
        item.meiDianIdArray      = _meiDianIdArray || [];
        item._shopName           = (item.shopId === 'VNPOP') ? '联合促销活动' : item.shopName;
        //对于店铺不能选择处理
        if (item.shopInfoProfileVO) {
            item._showDisabled = item.shopInfoProfileVO.showDisabled;
            if (item._showDisabled) {
                item._showDisabledClass = 'check-box--gray';
            }
        }
        return item;
    });
    data.meiDianIdArray = _meiDianIdArray || [];

    return data;
}
const parse = {
    parseCarts: parseCarts //解析整个loadCart数据 warn：强依赖于后端数据,"_xx"数据为 前端添加数据，不是后端传来数据
};

module.exports = parse;