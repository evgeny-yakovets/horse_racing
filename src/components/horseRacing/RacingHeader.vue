<script setup>
import {useStore} from "vuex";
const store = useStore()
</script>

<template>
<div class="flex justify-between gap-[4px] bg-red p-[8px]">
	<div data-testid="horseToolbarTitle">Horse Racing</div>
	<div class="flex flex-row gap-[4px]">
		<button class="bg-darkgray p-[8px] cursor-pointer"
		        data-testid="horseToolbarGenerateButton"
		        @click="store.dispatch('generateRacing')">
			Generate program
		</button>
		<button class="bg-darkgray p-[8px] cursor-pointer"
		        data-testid="horseToolbarStartPauseButton"
		        @click="store.dispatch('startPauseRacing')">
			Start / Pause
		</button>
	</div>
</div>
</template>

<style scoped>

</style>
