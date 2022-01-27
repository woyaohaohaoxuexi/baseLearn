<template>
  <TableColumn v-bind="config">

    <!-- 自定义表格头部 -->
    <template
      slot="header"
      slot-scope="scope"
    >
      <template v-if="!config.headerRender">{{ config.label }}</template>
      <RenderWrapper
        v-else
        :render-fn="config.headerRender(scope)"
      />
    </template>

    <!-- 自定义表格内容 -->
    <template slot-scope="scope">
      <template v-if="!config.contentRender">{{ scope.row[config.prop] }}</template>
      <RenderWrapper
        v-else
        :render-fn="config.contentRender(scope)"
      />
    </template>

    <!-- 多级表头 -->
    <template v-if="config.children">
      <SdTableColumn
        v-for="(item, index) in config.children"
        :key="index"
        :config="item"
      />
    </template>
  </TableColumn>
</template> 

<script>
import TableColumn from "element-ui/packages/table-column/index";
import RenderWrapper from "./renderWrapper.vue";

export default {
  name: "SdTableColumn",
  components: {
    TableColumn,
    RenderWrapper,
  },
  props: {
    config: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>