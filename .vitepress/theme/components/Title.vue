<script lang="ts" setup>
import { useData, onContentUpdated } from "vitepress";
import { ref } from "vue";
import PageTag from "./PageTag.vue"

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn"; // 引入中文语言包

dayjs.extend(relativeTime);
dayjs.locale("zh-cn"); // 设置为中文

const { page } = useData();
const publishDate = ref("");

onContentUpdated(() => {
  const { frontmatter, lastUpdated } = page.value;
  
  // 优先级：Git 时间 > Frontmatter 写的日期 > 当前时间
  const finalDate = lastUpdated || frontmatter.date || Date.now();
  
  // 渲染为相对时间，如 "3 天前"
  publishDate.value = dayjs().to(dayjs(finalDate));
});
</script>

<template>
  <h1 class="title">{{ page.title }}</h1>
  <PageTag />
  <div class="date">🕒 发布于: {{ publishDate }}</div>
</template>

<style scoped>
.title {
  color: var(--vp-c-text-1);
  font-weight: 600;
  font-size: 2.25em;
  margin-top: 0.3em;
  margin-bottom: 0.3em;
  line-height: 1.3;
  font-family: Dosis, ui-sans-serif, system-ui, -apple-system,
    BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans",
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
    "Noto Color Emoji";
}
.date {
  font-size: 0.875rem;
  line-height: 1.25rem;
  margin-bottom: 1em;
  padding-bottom: 1em;
  border-bottom: 1px dashed #c7c7c7;
}
</style>
