{
  inputs,
  ...
}:
{
  flake-file = {
    formatter = pkgs: pkgs.nixfmt-rs;

    inputs = {
      nixpkgs.url = "https://channels.nixos.org/nixos-unstable/nixexprs.tar.zst";
      flake-file.url = "github:denful/flake-file";
      flake-parts.url = "github:hercules-ci/flake-parts";
      import-tree.url = "github:denful/import-tree";
      flake-compat = {
        url = "github:NixOS/flake-compat";
        flake = false;
      };
    };

    outputs = "inputs: inputs.flake-parts.lib.mkFlake { inherit inputs; } (inputs.import-tree ./nix/modules)";
  };

  imports = [
    inputs.flake-parts.flakeModules.modules
    inputs.flake-file.flakeModules.dendritic
    inputs.flake-file.flakeModules.auto-follow
  ];
}
