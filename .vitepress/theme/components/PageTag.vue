<script setup>
import { useData } from "vitepress";
import { computed } from "vue";

const { frontmatter } = useData();
const tagArray = computed(() => {
    const { tags = "" } = frontmatter.value;
    // console.log(frontmatter.value)
    return tags;
});
</script>

<template>
    <div class="page-tags">
        <span v-for="tag in tagArray" :key="tag" class="page-tag">{{
            tag
        }}</span>
    </div>
</template>

<style scoped>
.page-tag {
    display: inline-block;
    background-color: #e0e0e0; /* 灰色背景 */
    border-radius: 4px; /* 圆角 */
    padding: 0px 4px; /* 内边距 */
    margin: 2px; /* 外边距 */
    font-size: 14px; /* 字体大小 */
    color: #333; /* 字体颜色 */
}
.page-tags {
    text-align: right
}
</style>
