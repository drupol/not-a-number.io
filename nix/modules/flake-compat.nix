{
  inputs,
  ...
}:
{
  imports = [
    inputs.flake-file.flakeModules.default
  ];

  flake-file.inputs = {
    flake-compat = {
      url = "github:NixOS/flake-compat";
      flake = false;
    };
  };
}
