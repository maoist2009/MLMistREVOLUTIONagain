<template>
    <div id="motto-container">
        <h6 id="motto-title">导师语录</h6>
        <p id="motto"  v-html="motto"></p>
        <br />
        <div class="mottofromparent" style="text-align: right">
            <div class="mottofrom" style="display: inline-block">
                {{ mottofrom }}
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useData, onMounted, onContentUpdated } from "vitepress";
import { ref, data, reactive } from "vue";
// file id select random from 1 to 10
const motto = ref("");
const mottofrom = ref("");
// get line content

onContentUpdated(() => {
    const file_id = Math.floor(Math.random() * 161) + 1;
    const motto_file = `/Mottos/${file_id}.txt`;
    //load motto from file，不要异步
    const motto_content_tmp = fetch(motto_file)
        .then(response => response.text())
        .then(content => {
            const motto_content = content;
            // alert(motto_content);
            // get number of lines in motto file
            const motto_lines: number = Math.floor( motto_content.split("\n").length / 2) ;
            // random line number
            const random_line = Math.floor(Math.random() * motto_lines);
            // console.log(random_line, motto_lines, motto_content);
            // 判断是否为windows格式
            if (motto_content.indexOf("\r\n") != -1) {
                motto.value = motto_content.split("\r\n")[random_line * 2];
                mottofrom.value = "---- " +
                    motto_content.split("\r\n")[random_line * 2 + 1];
            } else {
                motto.value = motto_content.split("\n")[random_line * 2];
                mottofrom.value = "---- " +
                    motto_content.split("\n")[random_line * 2 + 1];
            }
            // alert(motto.value);
        });
});
</script>
<style scoped>
#motto-container {
    text-align: left;
    /* margin-top: 10px;
  margin-top: 10px; */
    border: 4px double red;
    padding: 5px;
}
#motto-title {
    text-align: center;
}

#motto {
    margin-top: 5px;
}
</style>
