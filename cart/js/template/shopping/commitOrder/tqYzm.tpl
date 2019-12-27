<input 
	class="form-control mr5 {{if tqAtom.tqyzm_tip}}error{{/if}}" 
	style=" width:75px;vertical-align: middle;"
	g-keyup="setValueStage tqyzm this"
	value="${tqAtom.tqyzm}"
	name = "tqyzm"
	type="text"
	placeholder="验证码" 
	>
<span class="nValidate mr5"><img src="${groupOnImgcode}&capCd=${tqAtom.tqyzm_imgCode}"></span>
<a class=" fontBlue mr20 ml5" href="javascript:void(0)" g-click="setImgcodeStage tqyzm_imgCode,renderyzm">换一张</a>
{{if tqAtom.tqyzm_tip}}
<span class="fontRed ml5">${tqAtom.tqyzm_tip}</span>
{{/if}}