<template>
  <VNavigationDrawer expand-on-hover rail app permanent>
    <!-- User profile -->
    <VList>
      <VListItem
        prepend-avatar="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460"
        title="Ian Smith"
        subtitle="ian.smith@vaas.com"
      />
    </VList>

    <!-- Navigation Links -->
    <VList density="compact" nav>
      <VListItem prepend-icon="fas fa-plus" />
      <VListItem prepend-icon="mdi:mdi-minus" />
    </VList>
  </VNavigationDrawer>
</template>
