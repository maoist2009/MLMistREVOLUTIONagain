<script setup lang="ts">
import { Md5 } from 'ts-md5';
import { onContentUpdated, useRouter } from "vitepress";
import Giscus from '@giscus/vue';
import { ref } from 'vue';

let pathname = ref(location.pathname);
let MD5pathname = ref(Md5.hashStr(pathname));
onContentUpdated(() => {
  pathname.value = location.pathname;
  MD5pathname.value = Md5.hashStr(pathname.value);
});

</script>
<template>
  <Giscus id="comments"
    repo="maoist2009/MLMistREVOLUTIONagain"
    repo-id="R_kgDON1IXoA"
    data-category="Show and tell"
    data-category-id="DIC_kwDON1IXoM4CoUiZ"
    mapping="specific"
    :term="MD5pathname"
    reactions-enabled="1"
    emit-metadata="0"
    input-position="top"
    theme="preferred_color_scheme"
    lang="zh-CN"
    crossorigin="anonymous"
    :key="MD5pathname"
    async />
</template>
<style scoped></style>
