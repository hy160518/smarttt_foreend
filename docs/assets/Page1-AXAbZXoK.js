import{r as c,a as q,b as t,o as U,d as A,w as l,e,h as s,f as B,u as N,B as R}from"./index--w_LGvbd.js";import{_ as D}from"./_plugin-vue_export-helper-x3n3nnut.js";const P={slot:"footer",class:"dialog-footer"},E={__name:"Page1",setup(I){const r=c(!1),o=c({name:"",type:"",homepagename:"",homepageurl:""}),g=()=>{console.log(r.value),r.value=!0,console.log(r.value)},_=()=>{r.value=!1,console.log(o.value)},f=q({name:[{required:!0,message:"请输入角色名称",trigger:"blur"},{min:2,max:30,message:"角色名称长度在 2 到 30 个字符",trigger:"blur"}],type:[{required:!0,message:"请输入角色类型",trigger:"blur"}],homepagename:[{required:!0,message:"请输入首页名称",trigger:"blur"}],homepageurl:[{required:!0,message:"请输入首页地址",trigger:"blur"}],description:[{required:!0,message:"请输入角色描述",trigger:"blur"}],permissions:[{type:"array",required:!0,message:"请至少选择一个权限",trigger:"change"}]}),b=c([{id:"1",rolename:"超级管理员",roletype:"系统管理员",homepage:"首页"},{id:"2",rolename:"管理员",roletype:"系统管理员",homepage:"首页"},{id:"3",rolename:"普通用户",roletype:"普通用户",homepage:"首页"}]),h=i=>{r.value=!0,console.log(i)};return(i,a)=>{const p=t("el-button"),d=t("el-input"),m=t("el-form-item"),v=t("el-form"),y=t("el-dialog"),V=t("el-header"),u=t("el-table-column"),x=t("el-icon"),k=t("el-table"),w=t("el-main"),C=t("el-container");return U(),A(C,null,{default:l(()=>[e(V,{style:{height:"auto",padding:"5px 0px",width:"100%","background-color":"#deebf7",display:"flex","align-items":"center"}},{default:l(()=>[e(p,{type:"primary",style:{"margin-left":"0.8vw","margin-right":"0.8vw"},onClick:g},{default:l(()=>[s("添加")]),_:1}),e(y,{modelValue:r.value,"show-close":!1,"close-on-click-modal":!1,title:"新增角色"},{default:l(()=>[e(v,{ref:"form",model:o.value,rules:f,"label-width":"80px"},{default:l(()=>[e(m,{label:"角色名称",prop:"name"},{default:l(()=>[e(d,{modelValue:o.value.name,"onUpdate:modelValue":a[0]||(a[0]=n=>o.value.name=n),placeholder:"请输入角色名称"},null,8,["modelValue"])]),_:1}),e(m,{label:"角色类型",prop:"type"},{default:l(()=>[e(d,{modelValue:o.value.type,"onUpdate:modelValue":a[1]||(a[1]=n=>o.value.type=n),placeholder:"请输入角色类型"},null,8,["modelValue"])]),_:1}),e(m,{label:"首页名称",prop:"homepagename"},{default:l(()=>[e(d,{modelValue:o.value.homepagename,"onUpdate:modelValue":a[2]||(a[2]=n=>o.value.homepagename=n),placeholder:"请输入首页名称"},null,8,["modelValue"])]),_:1}),e(m,{label:"首页地址",prop:"homepageurl"},{default:l(()=>[e(d,{modelValue:o.value.homepageurl,"onUpdate:modelValue":a[3]||(a[3]=n=>o.value.homepageurl=n),placeholder:"请输入首页地址"},null,8,["modelValue"])]),_:1}),e(m,{label:"角色描述",prop:"description"},{default:l(()=>[e(d,{modelValue:o.value.description,"onUpdate:modelValue":a[4]||(a[4]=n=>o.value.description=n),type:"textarea",placeholder:"请输入角色描述"},null,8,["modelValue"])]),_:1})]),_:1},8,["model","rules"]),B("span",P,[e(p,{onClick:a[5]||(a[5]=n=>r.value=!1)},{default:l(()=>[s("取 消")]),_:1}),e(p,{type:"primary",onClick:_},{default:l(()=>[s("确 定")]),_:1})])]),_:1},8,["modelValue"]),e(p,{type:"danger",onClick:i.handleRoleDel},{default:l(()=>[s("删除")]),_:1},8,["onClick"])]),_:1}),e(w,null,{default:l(()=>[e(k,{data:b.value,style:{"table-layout":"auto",width:"100%"},stripe:""},{default:l(()=>[e(u,{type:"selection",width:"55"}),e(u,{prop:"id",label:"",width:"55"}),e(u,{prop:"rolename",label:"角色名称"}),e(u,{prop:"roletype",label:"角色类型"}),e(u,{prop:"homepage",label:"首页"}),e(u,{label:"操作"},{default:l(()=>[e(x,{class:"custom-icon",style:{float:"left","margin-top":"2px","margin-left":"3px"},onClick:h},{default:l(()=>[e(N(R))]),_:1})]),_:1})]),_:1},8,["data"])]),_:1})]),_:1})}}},j=D(E,[["__scopeId","data-v-a24fbb47"]]);export{j as default};