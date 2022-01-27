<template>
  <Table
    ref="table"
    v-bind="config"
    :data="data"
  >
    <SdTableColumn
      v-for="(item, index) in columns"
      :key="index"
      v-bind="item"
      :config="item"
    />
  </Table>
</template>

<script>
import { TableColumn } from "element-ui";
import Table from "element-ui/packages/table/index";
import SdTableColumn from "./SdTableColumn.vue";

export default {
  name: "SdTable",
  components: {
    Table,
    TableColumn,
    SdTableColumn,
  },
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
    },
    config: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
