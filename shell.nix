{ pkgs ? import <nixpkgs> {} }:
  pkgs.mkShell {
    name = "hugo-" + pkgs.hugo.version; 
    buildInputs = [ pkgs.hugo ];
}
