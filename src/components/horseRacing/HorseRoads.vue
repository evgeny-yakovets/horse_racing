<script setup>
import {useStore} from "vuex";
import HorseRoadItem from "@/components/horseRacing/common/HorseRoadItem.vue";
import {computed} from "vue";
const store = useStore()

const lapInformation = computed(() => {
	return store.getters.getLapNumber + '.st Lap ' + store.getters.getLapLength(store.getters.getLapNumber) + 'm'
})

</script>

<template>
<div class="w-[100%] px-[40px]">
	<div class="racing-roads pr-[46px] relative flex flex-col" data-testid="racingRoads">
		<HorseRoadItem v-for="(horse, index) in store.getters.getCurrentLapProgram"
		               :index="index+1"
		               :horseName="store.state.horseList[horse.horseIndex].name"
		               :horseColor="store.state.horseList[horse.horseIndex].color"
		               :distanceProgress="horse.distanceProgress/store.getters.getLapLength(store.getters.getLapNumber) * 100"
		               :position="store.getters.getCurrentLapHorseResult(horse.horseIndex)"
		/>

		<div data-testid="roadsFinishLabel" class="absolute right-[-25px] bottom-[-25px] text-red">
			FINISH
		</div>
	</div>

	<div data-testid="roadsLapInformation" class="flex justify-center text-red">
		{{lapInformation}}
	</div>
</div>
</template>

<style scoped>
.racing-roads {
	border-right: 3px solid red;
}
</style>