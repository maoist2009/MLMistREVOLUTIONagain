<template>
  <div class="shareCard">
    <h1 class="title">
      <span>我们是继续革命社&文革斗争社👋</span>
    </h1>
    <p class="description">
      XMPP上的革命组织
    </p>
    <h1 class="title">Other Accounts. </h1>
    <div class="description">
      <div class="Links">
        <!-- <a href="mailto:louie.pingu@outlook.com" target="_blank">
          <img src="/AccountsLinksIcon/outlook.svg" width="30" height="30" class="avator" />
        </a>
        <a href="mailto:louie.pingu@gmail.com" target="_blank">
          <img src="/AccountsLinksIcon/gmail.svg" width="30" height="30" class="avator" />
        </a>
        <a href="https://liaoyuan1949.site/u/louiesun/summary" target="_blank">
          <img src="/AccountsLinksIcon/bu2021.svg" width="30" height="30" class="avator" />
        </a>
        <a href="https://github.com/louiesun" target="_blank">
          <img src="/AccountsLinksIcon/GithubIcon.svg" width="30" height="30" class="avator" />
        </a>
      -->
        <a href="xmpp:%E9%A9%AC%E5%88%97%E6%AF%9B%E4%B8%BB%E4%B9%89%E7%BB%A7%E7%BB%AD%E9%9D%A9%E5%91%BD%E7%A4%BE@conference.conversations.im?join" target="_blank">
          <img src="/AccountsLinksIcon/xmpp.svg" width="30" height="30" class="avator" /> 
        </a>
        <a href="xmpp:gbudn19@conference.conversations.im?join" target="_blank">
          <img src="/AccountsLinksIcon/xmpp.svg" width="30" height="30" class="avator" /> 
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>
<style scoped>
.shareCard {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 15px;
  text-align: center;
}

.title {
  display: flex;
  align-items: center;
  font-size: 2.2em;
  font-weight: bold;
}

.description {
  margin: 1em 0;
}

.Links {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
}

.avator {
  border-radius: 50%;
  border: 1px solid var(--vp-avator-border);
}

@keyframes avator-transform {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(-360deg);
  }
}

.avator:hover {
  animation: 5s linear 0s infinite avator-transform;
}
</style>
