import { defineStore } from 'pinia'
import { ref ,computed } from 'vue'

export const useProfileStore = defineStore('profile', () => {
    const profileid = ref(null) // 用户id
    const profilename = ref(null) //用户名
    const profileroleid = ref(null) //角色id
    const profilerolename = ref(null) //角色名
    const profilecatelog = ref(null) //登录方式
    const profilehomeurl = ref(null) //登录主页



    function setProfileInfo(userid,username,roleid,rolename,catelog,homeurl) {
        profileid.value = userid // 正确的方式来设置 ref 的值
        profilename.value = username
        profileroleid.value = roleid
        profilecatelog.value = catelog
        profilehomeurl.value = homeurl
        profilerolename.value = rolename
    }

    function initProfileStore() {
        const storedUserInfo = sessionStorage.getItem('userInfo');
        if (storedUserInfo) {
            const userInfo = JSON.parse(storedUserInfo);
            setProfileInfo(userInfo.userid, userInfo.roleid, userInfo.rolename, userInfo.catelog, userInfo.homeurl);
            setProfilename(userInfo.username);
        }
    }

    // 在store创建时初始化状态
    initProfileStore();


    return {
        profileid,
        profilename,
        profileroleid,
        profilerolename,
        profilecatelog,
        profilehomeurl,
        setProfileInfo
    }
})
