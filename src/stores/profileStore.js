import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProfileStore = defineStore('profile', () => {
    const profileid = ref(null) // 使用 ref 创建一个响应式引用
    const profileroleid = ref(null)
    const profilecatelog = ref(null)
    const profilehomeurl = ref(null)
    function setProfileInfo(userid,roleid,catelog,homeurl) {
        profileid.value = userid // 正确的方式来设置 ref 的值
        profileroleid.value = roleid
        profilecatelog.value = catelog
        profilehomeurl.value = homeurl
    }

    return {
        profileid,
        profileroleid,
        profilecatelog,
        profilehomeurl,
        setProfileInfo
    }
})
