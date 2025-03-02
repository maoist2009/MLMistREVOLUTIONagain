<template>
  <div id="motto-container">
    <h6 id="motto-title">导师语录</h6>
    <p id="motto">{{ motto }}</p>
  </div>
</template>
<script lang="ts" setup>
import { useData, onMounted, onContentUpdated } from "vitepress";
import { ref, data, reactive } from "vue";
// file id select random from 1 to 10
const motto = ref('')
// get line content

onContentUpdated(() => {
  const file_id = Math.floor(Math.random() * 2) + 1;
  const motto_file = `/Mottos/${file_id}.txt`;
  //load motto from file，不要异步
  const motto_content_tmp = fetch(motto_file).then(response => response.text()).then(content => {
    const motto_content = content;
    // alert(motto_content);
    // get number of lines in motto file
    const motto_lines: number = motto_content.split('\n').length;
    // random line number
    const random_line = Math.floor(Math.random() * motto_lines);
    // console.log(random_line, motto_lines, motto_content);
    // 判断是否为windows格式
    if (motto_content.indexOf('\r\n') != -1) {
      motto.value = motto_content.split('\r\n')[random_line];
    }
    else { motto.value = motto_content.split('\n')[random_line]; }
    // alert(motto.value);
  });

});
</script>
<style scoped>
#motto-container {
  text-align: left;
  /* margin-top: 10px;
  margin-top: 10px; */
}
#motto-title {
  text-align: center ;
}

#motto {
  margin-top: 5px;
}
</style>
