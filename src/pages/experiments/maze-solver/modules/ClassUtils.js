window.ClassUtils = (function () {
  function setNonConfigurable (configurableKeys, props) {
    // the below mutates props
    for(var key of configurableKeys) {
      props[key].configurable = false;
    }
    // no need to return anything to more clearly signify mutation
  }

  function setNonWritable (configurableKeys, props) {
    // the below mutates props
    for(var key of configurableKeys) {
      props[key].writable = false;
    }
    // no need to return anything to more clearly signify mutation
  }

  function setValues (spec, props={}) {
    for(var key of Object.keys(spec)) {
      props[key] = {
        value: spec[key]
      };
    }
    return props;
  }

  return {
    setNonConfigurable,
    setValues,
    setNonWritable,
  }
})();
