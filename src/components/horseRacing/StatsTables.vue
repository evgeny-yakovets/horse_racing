<script setup>
import {useStore} from "vuex";
const store = useStore()
</script>

<template>
<div class="flex gap-[10px]">
	<div class="w-fit mh-[96vh] overflow-x-hidden">
		<div class="text-center bg-blue common-border">Program</div>
		<template v-for="lapProgram in store.getters.getLapProgram">
			<div class="bg-red">
				{{lapProgram.lapNumber + 'st Lap - ' + store.getters.getLapLength(lapProgram.lapNumber) + 'm'}}
			</div>
			<table>
				<thead>
				<tr>
					<th>Position</th>
					<th>Name</th>
				</tr>
				</thead>
				<tbody>
				<tr v-for="(horse, index) in lapProgram.horses">
					<td>{{index+1}}</td>
					<td>{{store.getters.getHorseName(horse.horseIndex)}}</td>
				</tr>
				</tbody>
			</table>
		</template>
	</div>
	<div class="w-fit min-w-[170px] mh-[96vh] overflow-x-hidden">
		<div class="text-center bg-green common-border">Results</div>
		<template v-for="lapResults in store.getters.getLapResults">
			<template v-if="lapResults.horses.length > 0">
				<div class="bg-red">
					{{lapResults.lapNumber + 'st Lap - ' + store.getters.getLapLength(lapResults.lapNumber) + 'm'}}
				</div>
				<table>
					<thead>
					<tr>
						<th>Position</th>
						<th>Name</th>
					</tr>
					</thead>
					<tbody>
					<tr v-for="(horse, index) in lapResults.horses">
						<td>{{index+1}}</td>
						<td>{{store.getters.getHorseName(horse.horseIndex)}}</td>
					</tr>
					</tbody>
				</table>
			</template>

		</template>

	</div>
</div>
</template>
