<script setup lang="ts">
import { Md5 } from 'ts-md5';
import { onContentUpdated, useData } from "vitepress";
import Giscus from '@giscus/vue';
import { ref, onMounted } from 'vue';

const { page } = useData();

const pathname = ref('');
const giscusTerm = ref('');

const updatePath = () => {
  if (typeof window !== 'undefined') {
    pathname.value = location.pathname;
    // extendPageData 已保证 title 有值
    const title = page.value.title || 'Untitled'; 
    const md5 = Md5.hashStr(pathname.value) as string;
    giscusTerm.value = `${title} - ${md5}`;
  }
};

onMounted(() => updatePath());
onContentUpdated(() => updatePath());
</script>

<template>
  <ClientOnly>
    <Giscus 
      repo="maoist2009/MLMistREVOLUTIONagain"
      repo-id="R_kgDON1IXoA"
      category="Website"
      category-id="DIC_kwDON1IXoM4C21cd"
      mapping="specific"
      :term="giscusTerm"
      :key="giscusTerm"
      reactions-enabled="1"
      emit-metadata="0"
      input-position="top"
      theme="preferred_color_scheme"
      lang="zh-CN"
      crossorigin="anonymous"
    />
  </ClientOnly>
</template>