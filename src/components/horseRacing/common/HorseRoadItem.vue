<script setup>

const props = defineProps({
	horseName: {type: String, required: true},
	horseColor: {type: String, required: true},
	distanceProgress: {type: Number, required: true},
	index: {type: Number, required: true},
})
</script>

<template>
<div class="flex w-[100%]">
	<div class="flex items-center justify-center bg-green border-[1px] border-solid border-white text-white h-[60px] w-[60px]">
		<div class="rotate-270">{{index}}</div>
	</div>
	<div class="w-[100%] relative road">
		<img
			class="w-[50px] h-[50px] absolute"
			:style="{left: distanceProgress +'%', filter: 'opacity(0.5) drop-shadow(0 0 0 '+horseColor+')'}"
			src="/assets/images/horse-on-race.png"
			:alt="horseName"
		/>
	</div>
</div>
</template>

<style scoped>
.road {
	border-bottom: 1px black dashed;
}
</style>