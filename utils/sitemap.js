export default {
  includeRoutes: function() {
    // Construct the routes.
    //
    // Google probably ignores priority and changefreq.  But it doesn't seem to do any harm.

    const routes = [
      {
        url: '/',
        changefreq: 'monthly',
        priority: 1
      }
    ]

    return routes
  },

  excludeRoutes: [
  ]
}
