<#if iSupport??>
<#assign isupportcenter = 'isupportcenter'>
</#if>
<div class="prd-firstscreen-center ${isupportcenter!}" id="gm-prd-main">
    <div class="hgroup">
        <h1>${prdInfo.name!}</h1>
    <#if page.merchantInfo??><#-- 联营 -->
        <#assign merchantInfo=page.merchantInfo!>
        <#assign merchant= 'ly'>
    <#else>
        <#assign merchant= ''>
    </#if>
        <h4 id="prdtitcx" ${merchant!}></h4>
    <#if prdInfo.sapSkuType?? && prdInfo.sapSkuType != "ECTZ">
        <div class="contrasts-wrapper shareDB" cid="${page.productId!}/${page.skuId!}">
            <label class="btn-contrasts">对比</label>
        </div>
    </#if>
    </div>
    <div class="prd-atmosphere-wrapper">
        <div class="pa-figure">
        </div>
        <#--<div class="pa-left">-->
            <#--<span>国美秒杀</span>-->
        <#--</div>-->
        <div class="pa-right">
            <div class="count-down"></div>
            <span class="endtime-tip"></span>
        </div>
    </div>
<#if prdInfo.sapSkuType?? && prdInfo.sapSkuType != "ECTZ">
    <#-- 2018-09-30需求：普通商品详情页添加预售入口 start-->
    <div class="yushou-entrance hide">
        <div class="yushou-entrance_left">
            <span class="label">预售中</span>
            <span class="deposit hide">定金<em data-before="￥" class="txt"></em></span>
            <span class="presale-price hide">预售价￥<em class="txt"></em></span>
            <div class="countdown hide" data-before="距离结束还有"></div>
        </div>
        <div class="yushou-entrance_right">
            <a href="javascript:;" target="_blank" class="goToYushou">></a>
        </div>
    </div>
    <#-- 2018-09-30需求：普通商品详情页添加预售入口 end-->
    <div class="prd-price-1">
        <div class="prd-price-other line33 p20  clearfix">
            <label class="prd-price-left">国&nbsp;&nbsp;美&nbsp;&nbsp;价</label>
            <div class="unitprice prd-price-right">
                <span id="prdPrice" class="price"></span>
                <a href="javascript:;" id="reduce" class="reduce">降价通知</a>

                <#if prdInfo.preferential?? && prdInfo.preferential  == '1'>
                <div class="applePricecon dn clearfix"><span class="applePrice" id="applePrice"><em>¥</em>890.00</span> <span class="applepriceicon" > <i></i>教育特惠价</span></div>
                </#if>
            </div>
            <div class="prd-price-flr">
                <div class="prd-price-line">|</div>
                <div class="prd-price-lineright">
                    <p>好评度<em id="haocnt">100%</em></p>
                    <p class="pincnt"><a href="javascript:;" class="reduce" id="goappr"><em id="pincnt">0</em>人评价</a></p>
                </div>
            </div>
        </div>
        <div class="prd-price-other lanjuan-top clearfix dn">
            <label class="prd-price-left">领&#x3000;&#x3000;劵</label>
            <div class="prd-price-right lanjuan" id="lanjuan"></div>
        </div>
        <div class="prd-price-other prd-cuxiao-other clearfix dn">
            <div class="cuxiaobox">
                <label class="prd-price-left cuxiao">促&#x3000;&#x3000;销</label>
                <div class="prd-price-right prd-promotions "></div>
            </div>
        </div>
    </div>
<#else>
<#-- 套购价格 -->
    <div class="prd-price-1">
           <div class="prd-price-other line33 p20  clearfix">
               <label class="prd-price-left">国&nbsp;&nbsp;美&nbsp;&nbsp;价</label>
               <div class="unitprice prd-price-right">
                   <span id="prdPrice" class="price"></span>
                   <a href="javascript:;" id="reduce" class="reduce">降价通知</a>
               </div>
               <div class="prd-price-flr">
                   <div class="prd-price-line">|</div>
                   <div class="prd-price-lineright">
                       <p>好评度<em id="haocnt">--</em></p>
                       <p class="pincnt"><a href="javascript:;" class="reduce" id="goappr"><em id="pincnt">0</em>人评价</a></p>
                   </div>
               </div>
           </div>      
    </div>
</#if>

    <div class="yuyuejia yuyue_price_info hide">
        <span class="prdLeft">预约价</span><strong id="promoPrice"></strong><label id="priceLable">预约中</label>
    </div>
    <div class="prd-properties" id="prd-properties_min">
        <div class="prd-properties-1">
        <#if prdInfo.sapSkuType?? && prdInfo.sapSkuType != "ECTZ">
            <div class="prd-properties-other m20 tese">
                <label class="prd-properties-left line20">特&#x3000;&#x3000;色</label>
                <div class="prd-properties-right">
                    <span class="yijiuhuanxin dn"><em></em><b></b><a href="javascript:;" target="_blank"></a></span><span class="baina dn"><em></em><b></b><a href="javascript:;" target="_blank"></a></span>
                    <#--<span class="guanjia"><em></em><b></b><a href="//www.gomegj.com" target="_blank">管家服务</a></span>-->
                    <span class="guanjia"><em></em><b></b><a href="//mall.gome.com.cn/80011410/" target="_blank">管家服务</a></span>
                    <#assign Intelligence='cat31665542,cat10000000,cat10000001,cat10000004'>
                    <#if Intelligence?index_of(page.firstCategoryId)!=-1 && !(page.merchantInfo??) >
                    <span class="intelligence"><em></em><b></b><a href="//smart.gome.com.cn" target="_blank">国美智能</a></span>
                    </#if> 
                </div>
            </div>
        </#if>
            <div class="prd-properties-other songzhi m8">
                <label class="prd-properties-left">送&#x3000;&#x3000;至</label>
                <div class="prd-properties-right" style="position:relative">
                    <div class="prd-properties-city">
                        <div class="prd-properties-citys clearfix">
                            <div class="address-wrapper" id="address">
                                <a href="javascript:;" class="region" id="stockaddress"></a>
                            </div>
                            <div class="gCity gCity-wrapper clearfix"></div>
                        </div>
                    </div>
                    <span class="hasstock" id="stockTxt"></span>
                    <span class="zhichi dn">支持</span>
                    <div id="show_xiangqing" class="pop-freightnote hide"></div>
                </div>
            </div>
            <div class="prd-properties-other m12 dn">
                 <label class="prd-properties-left tesu"></label>
                 <div class="prd-properties-right fumai"></div>
            </div>
            <div class="prd-properties-other m12 dn">
                 <label class="prd-properties-left tesu"></label>
                 <div class="prd-properties-right arrival"></div>
            </div>
            <#if prdInfo.selltype?? && prdInfo.selltype != "2">
            <div class="prd-properties-other fuwu m16">
                <label class="prd-properties-left">服&#x3000;&#x3000;务</label>
                <div class="prd-properties-right">
                    <span id="service_bable">
                        <#if merchantInfo??>
                            <#if prdInfo.sapSkuType?? && prdInfo.sapSkuType =="Z3PP">
                                <#if merchantInfo.merchantId?? &&  merchantInfo.merchantId=="80011770">
                                    由<a href="${storeConfiguration.mallSite!}/${merchantInfo.merchantId!}/" target="_blank">易果生鲜</a>配送，国美提供发票和售后服务.
                                <#else>
                                    由<a href="${storeConfiguration.mallSite!}/${merchantInfo.merchantId!}/" target="_blank">飞牛网</a>配送，国美提供发票和售后服务.
                                </#if>
                            <#else>
                                <#if merchantInfo.merchantId?? && merchantInfo.merchantId == "80010542">
                                    由<a href="${storeConfiguration.mallSite!}/${merchantInfo.merchantId!}/" target="_blank">${merchantInfo.merchantName!}</a>发货，国美提供售后服务及保障监管。
                                <#else>
                                    由<a href="${storeConfiguration.mallSite!}/${merchantInfo.merchantId!}/" target="_blank">${merchantInfo.merchantName!}</a>
                                    <span id="shipingAddr"></span>发货并负责售后服务。
                                </#if>
                            </#if>
                        <#else>
                        <#-- sellType:  //商品销售类型 (0=正常品(SMI)，1=G3PP商品，2=负卖商品（FM)，3=团购虚拟商品（TGXN） 5 =3PP商品   加套购判断(具体逻辑再详细咨询业务) -->
                            <#-- <#if prdInfo.sapSkuType?? && prdInfo.sapSkuType == "ECTZ">
                                由<b class="fwline">国美</b>配送并提供保障监管。
                            <#else>
                                <#if prdInfo.selltype == "0" || prdInfo.selltype == "1">
                                    由<b class="fwline">国美</b>配送并提供保障监管。
                                </#if>
                                <#if prdInfo.selltype == "5">
                                    由<b class="fwline">国美</b>安排厂商配送并提供保障监管。
                                </#if>
                            </#if> -->
                        </#if>
                    </span>
                </div>
            </div>
            </#if>
            <#-- 厂家安装 start -->
            <div class="prd-properties-other factory-installation dn">
                <label class="prd-properties-left">厂家安装</label>
                <div class="prd-properties-right">
                    <#-- 厂家电话 start -->
                    <span class="factory-phone"></span>
                    <#-- 厂家电话 end -->
                    <div class="more dn">
                        <a href="javascript:void(0);">帮助提示</a>
                        <div class="tips">
                            <div class="sanjiao"></div>
                            <div class="tip-body">
                                <#-- 安装说明 start-->
                                <p class="factory-infos"></p>
                                <#-- 安装说明 end -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <#-- 厂家安装 end -->
        </div>
         <#-- departmentStoreSkuType 展示重量的字段 -->
         <#if prdInfo.departmentStoreSkuType?? && prdInfo.departmentStoreSkuType=="gome-departmentStore-sku" && prdInfo.grossWeight??>
         <div class="prd-properties-other  m16">
            <label class="prd-properties-left">重&#x3000;&#x3000;量</label>
            <div class="prd-properties-right">${prdInfo.grossWeight!}${prdInfo.gWeightUnit!}</div>  
        </div>
        </#if>
        <div class="prd-properties-2">
            <#if prdInfo.sapSkuType?? && prdInfo.sapSkuType != "ECTZ">
                <#if (prdInfo.salesProperty)??>
                    <div id="salesProperty" class="m20">
                        <#assign picServer = storeConfiguration.pictureserver>
                        <#list prdInfo.salesProperty as salesProperty>
                            <#assign booleanPic="">
                            <#assign chinesename="">
                            <#assign booleanMainsale="">
                            <#assign nozhu="">
                            <#assign properties="">
                            <#assign hideSuitSku = "">
                            <#if salesProperty.hidden?? && salesProperty.hidden == "true">
                                <#assign hideSuitSku = "style='display:none'">
                            <#elseif salesProperty.hidden?? && salesProperty.hidden == "false" >
                                <#assign hideSuitSku = "style='display:block'">
                            </#if>
                            <#if salesProperty.booleanPic?? && salesProperty.booleanPic == "true">
                                <#assign booleanPic = "prdcol prd-img-item">
                                <#assign properties = "yanse">
                            <#elseif salesProperty.booleanPic?? && salesProperty.booleanPic == "false">
                                <#assign booleanPic = "">
                                <#assign properties = "banben">
                            </#if>
                            <#if salesProperty.chinesename??>
                                <#assign chinesename = salesProperty.chinesename>
                            </#if>
                            <#if salesProperty.booleanMainsale?? && salesProperty.booleanMainsale=="true">
                                <#assign booleanMainsale = "id='booleanMainsale'">
                            <#else>
                                <#assign nozhu="nozhu">
                            </#if>
                            <div class="prd-properties-other ${nozhu!''} ${properties}" ${booleanMainsale!} ${hideSuitSku!}>
                                <label class="prdLeft">${chinesename!}</label>
                                <div class="prdRight">
                                    <#if booleanPic?? && booleanPic=="prdcol prd-img-item">
                                        <#list salesProperty.skutions as skutions>
                                            <#if salesProperty.skutions?? && salesProperty.skutions?size &gt; 0>
                                                <#assign select = "">
                                                <#if skutions.target?? && skutions.target=="cur">
                                                    <#assign select = "select">
                                                <#else>
                                                    <#assign select = "novison">
                                                </#if>
                                                <div class="prdcol prd-img-item">
                                                    <#assign imgslod ="//app.gomein.net.cn/images/grey.gif">
                                                    <#assign color_imgSrc = imgslod><#--多颜色图片-->
                                                    <#if skutions.src?? && skutions.src!="">
                                                        <#assign color_imgSrc = "${skutions.src!}_60.jpg">
                                                    </#if>
                                                    <#assign linkArr="javascript:void(0);">
                                                    <#if skutions.linkOtherAttr?? && skutions.linkOtherAttr.url??>
                                                        <#assign linkArr= "${skutions.linkOtherAttr.url!}">
                                                    </#if>
                                                    <#if skutions.id??>
                                                        <#assign saleId="saleId='${skutions.id}'">
                                                    </#if>
                                                    <a href="${linkArr!}" class="${select!}" title="${skutions.title!}" data-alt="${skutions.alt!}" ${saleId!}>
                                                        <img src="${imgslod}" gome-src="${color_imgSrc}" alt="${skutions.title!}"/>
                                                        <span>${skutions.title!}</span><i></i>
                                                    </a>
                                                </div>
                                            </#if>
                                        </#list>
                                    <#else>
                                        <#list salesProperty.skutions as skutions>
                                            <#assign select = "">
                                            <#if skutions.target?? && skutions.target=="cur">
                                                <#assign select = "select">
                                            <#else>
                                                <#assign select = "novison">
                                            </#if>
                                            <div class="prdmod">
                                                <#assign linkArr="javascript:void(0);">
                                                <#if skutions.linkOtherAttr?? && skutions.linkOtherAttr.url??>
                                                    <#assign linkArr= "${skutions.linkOtherAttr.url!}">
                                                </#if>
                                                <#if skutions.id??>
                                                    <#assign saleId="saleId='${skutions.id}'">
                                                </#if>
                                                <a href="${linkArr!}" class="${select!}" title="${skutions.title!}" data-alt="${skutions.alt!}" ${saleId!}/>${skutions.title!}<i></i></a>
                                            </div>
                                        </#list>
                                    </#if>
                                </div>
                            </div>
                        </#list>
                    </div>
                </#if>
            </#if>
            <#if prdInfo.sapSkuType?? && prdInfo.sapSkuType =="ZJXK" >
                <div class="prd-properties-other heyuetaocan banben" id="zi_telecom">
                    <label class="prd-properties-left prdLeft">合约套餐</label>
                    <div class="prd-properties-right prdRight">
                        <#if prdInfo.sapSkuType =='ZJXK' && page.imPackages?? && page.imPackages?size &gt; 0>
                            <#assign curselect="">
                            <#assign ZihaowhiteCardSku="">
                            <#assign ZihaocardProductId="">
                            <#if page.telecomContract??>
                                <#assign ZihaowhiteCardSku="${page.telecomContract.whiteCardSku!}">
                                <#assign ZihaocardProductId="${page.telecomContract.cardProductId!}">
                            </#if>
                            <#list page.imPackages as sku>
                                <#if sku_index == 0>
                                    <#assign curselect="select">
                                <#else>
                                    <#assign curselect="">
                                </#if>
                                <div class="prdmod">
                                    <a href="javascript:void(0);" class="${curselect!'clicks'}" title="${sku.packageName!}" data-alt="${sku.packageName!}" saleid="${sku.imPackageId!}" Wskuid="${ZihaowhiteCardSku!}" Wpid="${ZihaocardProductId!}">${sku.packageName!}
                                        <i></i>
                                    </a>
                                </div>
                            </#list>
                        </#if>
                    </div>
                </div>
            </#if>
            <#if prdInfo.sapSkuType =='ZJXJ'>
                <div id="zi_telecom">
                    <div class="prd-properties-other taocanjihua banben">
                        <label class="prd-properties-left prdLeft">套餐计划</label>
                        <div class="prd-properties-right prdRight">
                            <#if  page.contractInfos?? && page.contractInfos?size &gt; 0>
                                <#assign curselect="">
                                <#list page.contractInfos as sku>
                                    <#if sku_index == 0>
                                        <#assign curselect="select">
                                    <#else>
                                        <#assign curselect="">
                                    </#if>
                                    <div class="prdmod">
                                        <a href="javascript:void(0);" class="${curselect!'clicks'}" title="${sku.packagePlanName!}" data-alt="${sku.packagePlanName!}" Tskuid="${sku.packageSku!}" Tpid="${sku.packageProductId!}" Wskuid="${sku.whiteCardSku!}" Wpid="${sku.cardProductId!}">${sku.packagePlanName!}<i></i></a>
                                    </div>
                                </#list>
                            </#if>
                        </div>
                    </div>
                    <div class="prd-properties-other heyuetaocan banben hide">
                        <label class="prd-properties-left prdLeft">合约套餐</label>
                        <div class="prd-properties-right prdRight" id="zi_telecom_plan"></div>
                    </div>
                </div>
            </#if>
            <#if prdInfo.sapSkuType?? && (prdInfo.sapSkuType =="ZHK" || prdInfo.sapSkuType =="ZLH" ||  prdInfo.sapSkuType =="ZHYJ")>
                <div class="prd-properties-other heyuetaocan hide">
                    <label class="prd-properties-left"></label>
                    <div class="prd-properties-right telecom_info" id="telecom_info"></div>
                </div>
            </#if>
            <#if prdInfo.sapSkuType?? && (prdInfo.sapSkuType =="ZHK" || prdInfo.sapSkuType =="ZLH" ||  prdInfo.sapSkuType =="ZHYJ" || prdInfo.sapSkuType =="ZJXK" || prdInfo.sapSkuType =="ZJXJ")>
                <div class="prd-properties-other shoujihaoma">
                    <label class="prd-properties-left">手机号码</label>
                    <div class="prd-properties-right" id="telecom_info">
                        <span id="telecom" class="telecom_phone">选择号码</span>
                        <span class="telecom_pic telecom_pic_hide"><i></i>请选择手机号码</span>
                        <span class="rechoose hide"><a href="javascript:void(0);" id="replay_sel">重选</a></span>
                    </div>
                </div>
            <#else>
             <#assign chartTxt = "加入购物车">
                <#if prdInfo.sapSkuType?? && prdInfo.sapSkuType!="ECTZ">
                    <#assign targetBlank="target='_blank'">
                <#else>
                    <#assign m16="m16">
                </#if>
                <#if page.suitInfo?? && page.suitInfo?size &gt; 0>
                    <div class="prd-properties-other xuanzexilie banben ${m16!}">
                        <label class="prdLeft">选择系列</label>
                        <div class="prdRight">
                            <#list page.suitInfo as Sku>
                                <#assign isture='${Sku.flag?string ("true","false")}'>
                                <#if isture?? && isture=="true">
                                    <#assign select="select">
                                    <#assign detailUrl="">
                                    <#assign onclicks="onclick='return false'">
                                <#else>
                                    <#assign select="">
                                    <#assign detailUrl="${Sku.detailUrl!}">
                                    <#assign onclicks="">
                                </#if>
                                <#--增加了type字段,0表示套装商品不同，1表示套装商品相同,其他字段不变-->
                                <#if Sku.type?? && Sku.type == 0>
                                    <div class="prdTaoGou prdmod different ${select!}">
                                        <#--<a href="javascript:;" class="prd-suit" data-skuid="${Sku.skuId!}" data-flag="${Sku.flag!}" data-url="${detailUrl!}" title="${Sku.description!}">${Sku.description!}</a>-->
                                        <a href="javascript:;" class="prd-suit" data-skuid="${Sku.skuId!}" data-url="${detailUrl!}" title="${Sku.description!}">${Sku.description!}</a>
                                        <div class="g-suits-dropdown"></div>
                                    </div>
                                <#else>
                                    <div class="prdTaoGou prdmod ${select!}">
                                        <a href="${detailUrl!}" ${onclicks!} class="prd-suit" title="${Sku.description!}">${Sku.description!}</a>
                                    </div>
                                </#if>
                            </#list>
                        </div>
                    </div>
                </#if>
                <#if prdInfo.sapSkuType?? && prdInfo.sapSkuType != "ECTZ">
                    <div class="prd-properties-other added-service banben  hide">
                        <label class="prdLeft">延保服务</label>
                        <div class="prdRight addedService" id="addedService">
                            <div class='more'>
                                <a href='javascript:void(0);'>帮助提示</a>
                                <div class='hide tips'>
                                    <div class='sanjiao'></div>
                                    <div class='tip-body'>
                                        <p>凡是在国美购买的家安保服务，在保障期间内遇到无论是正常使用中的问题还是意外事故，即可享受家安保服务。国美家安保内容包括：延长保修、只换不修、屏碎保护、意外保护、服务保障。覆盖家电、手机数码、电脑办公等商品。</p>
                                        <p class='shengming'><#if merchantInfo?? && merchantInfo.merchantId??>家安保服务，只能提供增值税普通电子发票，如有疑问，请与<span class='live800-service' data-customer_service_id='${merchantInfo.merchantId!}' data-hidestyle="normal" data-showstyle="normal" data-otherstyle="normal">在线客服</span>联系<#else>如有疑问，请与<span class='live800-service' data-customer_service_id='' data-hidestyle="normal" data-showstyle="normal" data-otherstyle="normal">在线客服</span>联系</#if></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </#if>
                <#if prdInfo.sapSkuType?? && prdInfo.sapSkuType != "ECTZ">
                    <div class="prd-properties-other yuyuejieshu hide" id="yuyue_daojishi">
                        <label class="prdLeft"></label>
                        <div class="prdRight">
                            <em class="d">00</em>
                            <span>天</span>
                            <em class="h">09</em>
                            <span>时</span>
                            <em class="m">11</em>
                            <span>分</span>
                            <em class="s">30</em>
                            <span>秒</span>
                            <div id="yushouCount" class="total">
                                <span>已有</span>
                                <strong>0</strong>
                                <span>人成功预约</span>
                            </div>
                        </div>
                    </div>
                </#if>
                <!--套装商品不支持美易分-->
                <#if prdInfo.sapSkuType?? && prdInfo.sapSkuType != "ECTZ">
                <div class="prd-properties-other meiyifen dn">
                </div>
                </#if>
            </#if>
        </div>
    </div>                 
    <div class="prd-buttons" id="btnLink">
    <#if prdInfo.sapSkuType?? && (prdInfo.sapSkuType =="ZHK" || prdInfo.sapSkuType =="ZLH" ||  prdInfo.sapSkuType =="ZHYJ" || prdInfo.sapSkuType =="ZJXK" || prdInfo.sapSkuType =="ZJXJ")>
    <#else>
    <div class="count-wrapper" id="btnCount">
        <input type="text" class="quantity j-gACval" id="enterQty" maxlength="5" value="1" onfocus="this.className='j-gACval quantity focus'" onblur="this.className='quantity j-gACval'" autocomplete="off">
        <a href="javascript:;" class="plus j-gACbtnA">+</a>
        <a href="javascript:;" class="minus j-gACbtn">-</a>
    </div>
    <div class="remainbox dn"></div>
    </#if>
    <#if prdInfo.sapSkuType?? && prdInfo.sapSkuType != "ECTZ">
        <a href="javascript:;" id="yuyue" class="btn-product btn-appointment hide">立即预约</a>
        <a href="javascript:;" id="qianggou" class="btn-product btn-purchase hide">立即抢购</a>
    </#if>
    <#if prdInfo.sapSkuType?? && (prdInfo.sapSkuType =="ZHK" || prdInfo.sapSkuType =="ZLH" ||  prdInfo.sapSkuType =="ZHYJ" || prdInfo.sapSkuType =="ZJXK" || prdInfo.sapSkuType =="ZJXJ") ><#-- 电信卡合约机等不展示快速购,加入购物车以及分期购 -->
        <a href="javascript:;" class="btn-product btn-addcart" id="telecom_buy">立即购买</a>
    <#else>
        <#-- 2018-09-30需求：普通商品详情页添加预售入口 start-->
        <a href="javascript:;" target="_blank" class="btn-product btn-yushou hide">预售</a>
        <#-- 2018-09-30需求：普通商品详情页添加预售入口 end-->
        <a href="javascript:;" class="btn-product btn-addcart" id="addCart">${chartTxt}</a>
        <#if prdInfo.sapSkuType?? && prdInfo.sapSkuType=="ECTZ">
        <#else>
            <#if prdInfo.sapSkuType?? && prdInfo.sapSkuType!="Z3PP"><#-- 飞牛和海外生鲜不显示分期购 -->
               <#if page.thirdCategoryId??>
                <#assign thirdCategoryId=page.thirdCategoryId>
               </#if>
                <#if page.coo8thirdCategoryId??>
                <#assign coo8thirdCategoryId=page.coo8thirdCategoryId>
               </#if>
                <#if (thirdCategoryId??&&(thirdCategoryId=='cat10005493' || thirdCategoryId=='cat15985697' || thirdCategoryId=='cat15985849' || thirdCategoryId=='cat18000146' || thirdCategoryId=='cat21455926' || thirdCategoryId=='cat32897453' || thirdCategoryId=='cat33367117' || thirdCategoryId=='catx10000376' || thirdCategoryId=='catx10000695' || thirdCategoryId=='cat16035593' || thirdCategoryId=='cat21455947' || thirdCategoryId=='cat21455928' || thirdCategoryId=='cat21455931')) || (coo8thirdCategoryId??&&(coo8thirdCategoryId=='cat10005493' || coo8thirdCategoryId=='cat15985697' || coo8thirdCategoryId=='cat15985849' || coo8thirdCategoryId=='cat18000146' || coo8thirdCategoryId=='cat21455926' || coo8thirdCategoryId=='cat32897453' || coo8thirdCategoryId=='cat33367117' || coo8thirdCategoryId=='catx10000376' || coo8thirdCategoryId=='catx10000695' || coo8thirdCategoryId=='cat16035593' || coo8thirdCategoryId=='cat21455947' || coo8thirdCategoryId=='cat21455928' || coo8thirdCategoryId=='cat21455931'))>
                <#else>
                    <a href="javascript:;" class="btn-product btn-stages dn" id="pay_fenQi">分期购</a>
                    <a href="javascript:;" class="btn-product btn-meiyifen dn">国美易卡</a>
                </#if>  
            </#if>
            <#if (prdInfo.sapSkuType?? && (prdInfo.sapSkuType=="ZSTK" || prdInfo.sapSkuType=="ZDZK")) || (page.firstCategoryId?? && page.firstCategoryId == "cat10000004")> <#-- 美通卡不展示快速购快速购优化大家电不展示快速购, -->
            <#else>
                <a href="javascript:;" id="easyShopping" class="btn-product btn-easeshopping dn" data_easy="1">快速购</a>
            </#if>
        </#if>
        <#if prdInfo.preferential?? && prdInfo.preferential=='1'>
         <a href="javascript:;" id="applebtn"  class="btn-product btn-easeshopping dn">教育优惠</a>
        </#if>
        <#if prdInfo.sapSkuType?? && prdInfo.sapSkuType != "ECTZ">
        <a href="javascript:;" id="mobtn" class="btn-product mobtn"><i class="mobtnma"></i>手机下单 <div><img _src="${storeConfiguration.staSite?replace('www','ss')}/item/v1/qr/verify/${page.productId!}/${page.skuId!}/flag/item"  alt="二维码"></div></a>
        </#if>
        <a href="javascript:;" class="btn-product btn-hasstock dn" id="arrival">到货通知</a>
        <a href="javascript:;" class="btn-product btn-off-loading hide">商品下架</a>
    </#if>
        <#-- 快速购提示框 start-->
        <#-- 状态：1.未登录；2.已登录；3.登录后地址信息-->
        <div class="easyShopping_box pop-easeshopping hide">
            <div class="ETooltips-arr"></div>
        </div>
        <#-- 快速购提示框 end-->
        <!--参加节能补贴提示说明 start-->
        <div class="pop-energy-saving hide"></div>
        <!--参加节能补贴提示说明 end-->
        <#-- 预约提示 start -->
        <#if prdInfo.sapSkuType?? && prdInfo.sapSkuType != "ECTZ">
            <div id="yuye_more" class="appointment-wrapper hide">
                <a href="javascript:;"><i></i>了解预约抢购</a>
                <div id="yuye_more_msg" class="hide appointment-tips">
                    <i class="btn-arrow-left"></i>
                    <p>预约抢购规则</p>
                    <p>1、欢迎预约购买，请在正式开售之后下单付款；</p>
                    <p>2、商品开售后，仅有已预约的用户可购买商品；</p>
                    <p>3、每人限购一件，先到先得。</p>
                </div>
            </div>
        </#if>
        <#-- 预约提示 end -->
    <#if prdInfo.preferential?? && prdInfo.preferential=='1'>
    <div class="appletip dn">本商品参加苹果官网教育优惠活动，<a target="_blank"  href="//help.gome.com.cn/article/455-0-0.html">查看详情</a></div>
    </#if>
    </div>
<#if prdInfo.sapSkuType?? && prdInfo.sapSkuType != "ECTZ">
    <div class="prd-tips wenxintishi_wrap clearfix">
        <p>温馨提示</p>
        <ol class="wenxinti">
        <#if page.serviceTags??>
            <#assign serviceTags=page.serviceTags!>
            <li> 
            <#if serviceTags.genuine??>
                  ${serviceTags.genuine!}；
            </#if>
            <#if serviceTags.back??>
                支持${ serviceTags.back!}
            </#if>
            <#if serviceTags.back_15??>
                支持${ serviceTags.back_15!}
            </#if>
            <#if serviceTags.back_no??>
                ${ serviceTags.back_no!}
            </#if>
            </li>
        </#if>
        </ol>
    </div>
</#if>
</div>
