{ inputs, ... }:
{
  flake-file.inputs = {
    treefmt-nix.url = "github:numtide/treefmt-nix";
  };

  imports = [ inputs.treefmt-nix.flakeModule ];

  perSystem =
    { lib, pkgs, ... }:
    {
      treefmt = {
        projectRootFile = "flake.nix";
        programs = {
          deadnix.enable = true;
          jsonfmt.enable = true;
          nixfmt.enable = true;
          prettier.enable = true;
          yamlfmt.enable = true;
        };
        settings = {
          no-cache = true;
          on-unmatched = "warn";
          formatter = {
            "json-sort" = {
              command = lib.getExe pkgs.json-sort;
              options = [ "--fix" ];
              includes = [ "*.json" ];
            };
            prettier = {
              excludes = [ "*.html" ];
            };
          };
        };
      };
    };
}
