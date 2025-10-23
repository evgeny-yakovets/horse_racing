<script setup>
import {useStore} from "vuex";
const store = useStore()
</script>

<template>
<div class="mh-[96vh]">
	<div class="text-center bg-yellow common-border">
		Horse List (1 - 20)
	</div>
	<div>
		<table>
			<thead>
			<tr>
				<th>Name</th>
				<th>Condition</th>
				<th>Color</th>
			</tr>
			</thead>
			<tbody>
				<tr v-for="horse in store.state.horseList">
					<td>{{horse.name}}</td>
					<td>{{horse.condition}}</td>
					<td><div class="capitalize">{{horse.color}}</div></td>
				</tr>
			</tbody>
		</table>
	</div>
</div>
</template>

<style scoped>

</style>