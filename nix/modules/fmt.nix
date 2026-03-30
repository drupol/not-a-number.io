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
            "json-sort-cli" = {
              command = "${lib.getExe pkgs.bash}";
              options = [
                "-euc"
                ''
                  for file in "$@"; do
                    ${lib.getExe pkgs.json-sort-cli} $file --insert-final-newline true --autofix || true
                  done
                ''
                "--" # bash swallows the second argument when using -c
              ];
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
