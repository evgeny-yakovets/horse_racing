<script setup>
import {useStore} from "vuex";
const store = useStore()
</script>

<template>
<div class="flex gap-[10px]">
	<div class="w-fit mh-[96vh] overflow-x-hidden">
		<div class="text-center bg-blue common-border" data-testid="horseProgramTitle">Program</div>
		<template v-for="lapProgram in store.getters.getLapProgram">
			<div class="bg-red text-center" data-testid="horseProgramLapInfo">
				{{lapProgram.lapNumber + 'st Lap - ' + store.getters.getLapLength(lapProgram.lapNumber) + 'm'}}
			</div>
			<table data-testid="horseProgramLapTable">
				<thead>
					<tr>
						<th data-testid="horseProgramLapTablePositionHeader">Position</th>
						<th data-testid="horseProgramLapTableNameHeader">Name</th>
					</tr>
				</thead>
				<tbody>
				<template v-for="(horse, index) in lapProgram.horses">
					<tr data-testid="horseProgramRow">
						<td data-testid="horseProgramRowIndex">{{index+1}}</td>
						<td>
							<div data-testid="horseProgramRowHorseName" :style="{color: store.getters.getHorseColor(horse.horseIndex)}">
								{{store.getters.getHorseName(horse.horseIndex)}}
							</div>
						</td>
					</tr>
				</template>
				</tbody>
			</table>
		</template>
	</div>
	<div class="w-fit min-w-[170px] mh-[96vh] overflow-x-hidden">
		<div class="text-center bg-green common-border" data-testid="horseResultTitle">Results</div>
		<template v-for="lapResults in store.getters.getLapResults">
			<template v-if="lapResults.horses.length > 0">
				<div class="bg-red text-center" data-testid="horseResultLapInfo">
					{{lapResults.lapNumber + 'st Lap - ' + store.getters.getLapLength(lapResults.lapNumber) + 'm'}}
				</div>
				<table data-testid="horseResultTable">
					<thead>
					<tr>
						<th data-testid="horseResultTableResultHeader">Position</th>
						<th data-testid="horseResultTableResultName">Name</th>
					</tr>
					</thead>
					<tbody>
					<template v-for="(horse, index) in lapResults.horses">
						<tr data-testid="horseResultRow">
							<td data-testid="horseResultRowIndex">{{index+1}}</td>
							<td>
								<div data-testid="horseResultRowHorseName" :style="{color: store.getters.getHorseColor(horse.horseIndex)}">
									{{store.getters.getHorseName(horse.horseIndex)}}
								</div>
							</td>
						</tr>
					</template>
					</tbody>
				</table>
			</template>
		</template>
	</div>
</div>
</template>
