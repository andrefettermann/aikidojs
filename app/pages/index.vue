<script setup>
definePageMeta({
  middleware: () => {
    return navigateTo('/login')
  }
})
</script>