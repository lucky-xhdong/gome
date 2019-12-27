<div class="addpop addpopwarp pr bgwhite box-sd2" id="id_newAddress">
    <div class="addInput popbd pr">
        <!--{{if type!="noAddress" && data.isSupportGomeStore}}
        <ul class="addTabs" id="id_addtab">
          <li class="active">配送上门</li>
          <li class="mlf6">门店自提
            <span class="myf mr10 pr">免运费<b class="triangle-topleft"></b></span>
          </li>
        </ul>
        {{/if}}-->
        {{if close}}
        <a id="closeaddress" class="closed c-i closebtn-new pabs" href="javascript:void(0)"></a>
        {{/if}}
        {{if $config.shoppingAddressAtom.novalidAddr}}
        <span class="addr_fail" >
      <i class="c-i attention fl" style="margin:1px 5px 0px 0px;"></i>
      {{html $config.notice.GOME_SHDZ_UPGRADE_TIP}}
    </span>
        {{/if}}
        <div class="consigneeContentTab">
            <div class="add_table">
                <div class="pr">
                    <div class="pabs" style="top:132px;right:-43px;width:193px">
                        <div style="height:6px;"></div>
                        <p class="hide" style="margin-left:5px;"  g-tip-validate="phone" >   </p>
                        <p class="hide" style="margin-left:5px;" g-tip-validate="call">   </p>
                    </div>
                </div>
                <table width="100%" cellspacing="0" cellpadding="0">
                    <tbody>
                    <tr>
                        <td align="right"><i class="fontRed">* </i>收货人：</td>
                        <td colspan="4">
                            {{if $config.isReadOnlyConsignee()}}
                            ${name}
                            {{else}}
                            <input
                                    name="consignee"
                                    g-validate="consignee"
                                    type="text"
                                    style="width:142px"
                                    class="form-control fl"
                                    value="${name}" >
                            {{/if}}
                            {{if $page.site=="allowance"}}
                            <a href="/save/energy/allowance?productId=${origin.allowanceProId}&skuId=${origin.allowanceSkuId}"
                               class="btn btn-default">重新填写认证信息</a>
                            {{/if}}
                            <p class="ntishi fl" g-tip-validate="consignee">
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td align="right"><i class="fontRed">* </i>所在地：</td>
                        <td colspan="4 ">
                            <div style="float:left;" class="pr" id="id_address_select">
                  <span style="border-color:#e5e5e5;" >
                    <a  href="javascript:void(0)" name="address"
                        g-validate="address"
                        {{if type=="modify"}}
                        value="${origin.address.provinceCode}.${origin.address.cityCode}.${origin.address.countyCode}.${origin.address.townCode}"
                        {{else}}
                        value=""
                        {{/if}}
                      class="add_select" >
                      {{if type=="modify"}}
                        <span show-label>${uniqueAddress}</span>
                      {{else}}
                        <span show-label class="fl">请选择</span>
                      {{/if}}
                       <i class="c-i select_arrowup ml10 mt10"></i>
                      </a>
                  </span>
                                <div class="pr add_out hide">
                                    <em class="pabs c-i arrowup add_up2"></em>
                                    <div class="gCity"></div>
                                </div>
                            </div>
                            <!--  <p class="ntishi fl"><span class="nLowLeight">标"*"的为支持货到付款的地区</span></p> -->
                            <p class="ntishi fl" g-tip-validate="address"></p>
                        </td>
                    </tr>
                    <tr>
                        <td align="right"><i class="fontRed">* </i>详细地址：</td>
                        <td colspan="4">
                            <input name="detailAddress" g-validate="detailAddress" type="text" style="width:520px" class="form-control fl"
                                   {{if type=="modify"}}
                                   value="${origin.address.detailedAddress}"
                                   {{/if}}
                            >
                            <p class="ntishi fl" g-tip-validate="detailAddress"></p>
                        </td>
                    </tr>
                    <tr class="ntelEmail">
                        <td width="110" align="right"><i class="fontRed">* </i>手机号码：</td>
                        <td width="245">
                            <input type="" name="phone" g-validate="phone" style="width:209px" class="form-control fl"
                                   {{if type=="modify"}}
                                   value="${origin.mobileNumber}"
                                   {{/if}}
                            >
                        </td>
                        <td width="65" align="right">固定电话：</td>
                        <td class="pr">
                            <input name="call" type="text"  g-validate="call" style="width:209px" class="form-control fl"
                                   {{if type=="modify"}}
                                   value="${origin.phoneNumber}"
                                   {{/if}}
                            >
                            <p class="fl" style="visibility: hidden;">xxxxxxxxxxx</p>
                            <p class="fl" style="visibility: hidden;">xxxxxxxxxxx</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="right">邮件：</td>
                        <td colspan="4">
                            <input name="email" type="text" g-validate="email" style="width:209px" class="form-control fl"{{if type=="modify"}}
                                   value="${origin.email}"
                                   {{/if}}
                            >
                            <p class="ntishi fl"><span class="nLowLeight">方便您实时接收订单状态提醒</span></p>
                            <p class="ntishi fl" g-tip-validate="email"></p>
                        </td>
                    </tr>
                    <tr>
                        <td align="right"></td>
                        <td colspan="4">
                <span class="default_address">
                {{if $config.isDisabledDefaultAddress()}}
                {{else}}
                    {{if type=="modify"}}
                    <b class="c-i ${isdefault?'checkbox_chose':'checkboxs'} fl" name="defaultAddress" value="${isdefault?1:0}" ></b>
                    {{else}}
                    <b class="c-i checkboxs fl" name="defaultAddress" value="0" ></b>
                    {{/if}}
                <em class="fl">设置默认地址</em></span>
                            {{/if}}
                        </td>
                    </tr>
                    </tbody></table>
            </div>
            <a href="javascript:void 0" class="btn btn-primary btn-large" style="margin-left: 110px;margin-top: 10px;" id="id_saveAddress">保存收货信息</a>
        </div>
        <div class="consigneeContentTab" style="display:none">
            <div id="add-address-stores"></div>
        </div>
    </div>
</div>
