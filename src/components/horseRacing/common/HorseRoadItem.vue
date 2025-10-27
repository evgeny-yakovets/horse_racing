<script setup>

const props = defineProps({
	horseName: {type: String, required: true},
	horseColor: {type: String, required: true},
	distanceProgress: {type: Number, required: true},
	index: {type: Number, required: true},
	position: {type: [Number, null], default: null},
	testId: {type: String, default: 'horseRoadItem'},
})
</script>

<template>
<div class="flex w-[100%]" :data-testid="testId">
	<div class="flex items-center justify-center bg-green border-[1px] border-solid border-white text-white h-[60px] w-[60px]">
		<div class="rotate-270"  :data-testid="testId + 'Index'">{{index}}</div>
	</div>
	<div class="w-[100%] relative road">
		<img
			:data-testid="testId + 'Image'"
			class="w-[50px] h-[50px] absolute"
			:style="{left: distanceProgress +'%', filter: 'opacity(0.5) drop-shadow(0 0 0 '+horseColor+')'}"
			src="/assets/images/horse-on-race.png"
			:alt="horseName"
		/>
		<div v-if="position" class="absolute top-[50%] right-[-75px]" :data-testid="testId + 'Position'">
			{{position}}
		</div>
	</div>
</div>
</template>

<style scoped>
.road {
	border-bottom: 1px black dashed;
}
</style>