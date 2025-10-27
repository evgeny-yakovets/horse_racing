<script setup>
import {useStore} from "vuex";
const store = useStore()
</script>

<template>
<div class="mh-[96vh]">
	<div class="text-center bg-yellow common-border" data-testid="horseListTitle">
		Horse List (1 - 20)
	</div>
	<div>
		<table data-testid="horseListTable">
			<thead>
			<tr>
				<th data-testid="horseListTableNameHeader">Name</th>
				<th data-testid="horseListTableConditionHeader">Condition</th>
				<th data-testid="horseListTableColorHeader">Color</th>
			</tr>
			</thead>
			<tbody>
				<template v-for="horse in store.state.horseList">
					<tr data-testid="horseListRow">
						<td data-testid="horseListRowName">{{horse.name}}</td>
						<td data-testid="horseListRowCondition">{{horse.condition}}</td>
						<td>
							<div data-testid="horseListRowColor" class="capitalize" :style="{color: store.getters.getHorseColor(horse.horseIndex)}">
								{{horse.color}}
							</div>
						</td>
					</tr>
				</template>
			</tbody>
		</table>
	</div>
</div>
</template>

<style scoped>

</style>