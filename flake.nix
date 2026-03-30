# DO-NOT-EDIT. This file was auto-generated using github:vic/flake-file.
# Use `nix run .#write-flake` to regenerate it.
{
  outputs =
    inputs: inputs.flake-parts.lib.mkFlake { inherit inputs; } (inputs.import-tree ./nix/modules);

  inputs = {
    flake-compat = {
      url = "github:NixOS/flake-compat";
      flake = false;
    };
    flake-file.url = "github:vic/flake-file";
    flake-parts.url = "github:hercules-ci/flake-parts";
    import-tree.url = "github:vic/import-tree";
    make-shell.url = "github:nicknovitski/make-shell";
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    pkgs-by-name-for-flake-parts.url = "github:drupol/pkgs-by-name-for-flake-parts";
    treefmt-nix.url = "github:numtide/treefmt-nix";
  };
}
