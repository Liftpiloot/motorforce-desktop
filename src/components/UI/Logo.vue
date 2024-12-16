<script setup lang="ts">

const props = defineProps({
  loading: Boolean
});

</script>

<template>
  <div class="moto-force-icon" :class="{loading: props.loading}">
    <img src="../../components/icons/Desktop-logo.svg" alt="Moto Force Icon"/>
  </div>
</template>

<style scoped lang="scss">

.moto-force-icon {
  display: flex;
  width: 22.5rem;
  padding: 0.75rem 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  flex-shrink: 0;

  img {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.625rem;
  }
}

.moto-force-icon.loading img {
  animation: neon 5s infinite;
}

@keyframes neon {
  0% {
    filter: hue-rotate(0deg);
  }
  50% {
    filter: hue-rotate(360deg);
  }
  100% {
    filter: hue-rotate(0deg);
  }
}

</style>