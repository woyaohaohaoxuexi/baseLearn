<script>
export default {
  functional: true,
  render(h, context) {
    return context.props.renderFn(h);
  },
};
</script>
