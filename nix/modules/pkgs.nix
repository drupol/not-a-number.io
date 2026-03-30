{ inputs, ... }:
{
  flake-file.inputs = {
    pkgs-by-name-for-flake-parts.url = "github:drupol/pkgs-by-name-for-flake-parts";
  };

  imports = [
    inputs.pkgs-by-name-for-flake-parts.flakeModule
  ];

  perSystem =
    { system, ... }:
    {
      pkgsDirectory = ../pkgs;

      _module.args.pkgs = import inputs.nixpkgs {
        inherit system;
        config.permittedInsecurePackages = [
          "python-2.7.18.12"
        ];
      };
    };
}
