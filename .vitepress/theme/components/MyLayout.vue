<template>
  <Layout>
    <template #doc-before>
      <Title />
      <Category />
      <Motto />
    </template>
    <template #doc-after>
      <div>
        <button @click="cdf">cd ..</button>
        <br />
        <button @click="back">Back</button>
      </div>
      <Comments />
      <CopyWright />
    </template>
    <!-- Home slot-->
    <template #home-hero-before>
      <HomeHero />
    </template>
    <template #home-features-after>
      <Page />
      <CopyWright />
    </template>
  </Layout>
</template>
<script lang="ts" setup>
import DefaultTheme from "vitepress/theme";
import HomeHero from "./HomeHero.vue";
import CopyWright from "./CopyWright.vue";
import Comments from "./Comments.vue";
import Page from "./Page.vue";
import Category from "./Category.vue";
import Title from "./Title.vue";
import Motto from "./Motto.vue";
const { Layout } = DefaultTheme;
const cdf = () => {
  if (location.href.endsWith("/"))
    location.assign("../");
  else
    location.assign("./");
};
const back = () => {
  history.back();
};
</script>
<style scoped>
button {
  display: inline-block;
  position: relative;
  color: var(--vp-c-color-d);
  cursor: pointer;
  font-size: 1.2em;
  font-weight: bold;
}

button::after {
  content: "";
  position: absolute;
  width: 100%;
  transform: scaleX(0);
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: var(--vp-c-color-d);
  transform-origin: bottom right;
  transition: transform 0.25s ease-out;
}

button:hover::after {
  transform: scaleX(1);
  transform-origin: bottom left;
}
</style>
