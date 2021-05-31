exports.onRouteUpdate = (_, { includeInDevelopment }) => {
  if (process.env.NODE_ENV !== "production" && !includeInDevelopment) {
    return;
  }
  setTimeout(() => {
    window.dataLayer.push({
      event: "ga.page",
      eventNonInteraction: true,
    });
  }, 150);
};
