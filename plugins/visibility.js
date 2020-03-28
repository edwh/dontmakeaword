import visibility from '@/utils/visibility'

export default ({ store }) => {
  store.watch(() => visibility.visible, async function(visible) {})
}
