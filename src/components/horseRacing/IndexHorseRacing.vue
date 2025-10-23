<script setup>
import RacingHeader from "@/components/horseRacing/RacingHeader.vue";
import HorseList from "@/components/horseRacing/HorseList.vue";
import HorseRoads from "@/components/horseRacing/HorseRoads.vue";
import StatsTables from "@/components/horseRacing/StatsTables.vue";

import {useStore} from "vuex";
const store = useStore()
</script>

<template>
<div class="flex flex-col w-[100%] px-[12px] py-[8px] gap-[20px]">
	<RacingHeader/>
	<div v-if="store.getters.getLapNumber" class="flex justify-between">
		<HorseList/>
		<HorseRoads/>
		<StatsTables/>
	</div>
</div>
</template>

<style scoped>

</style>