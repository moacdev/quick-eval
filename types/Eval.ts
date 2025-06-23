import Cuisine from "./Cuisine";
import Danse from "./Danse";
import OrganisationGroup from "./OrganisationGroup";

export default class Eval {
  type: string;
  name: string;
  cuisine: Cuisine;
  danse: Danse;
  organisation_group: OrganisationGroup;
  image_url: string;
  constructor(type: string, name: string, image_url?: string) {
    this.type = type;
    this.name = name;
    this.image_url = image_url;
    this.cuisine = {
      presentation_service: 0,
      presentation_plat: 0,
      gout: 0,
    };
    this.danse = {
      originalite: 0,
      occupation_scenique: 0,
      expression_du_corps: 0,
    };
    this.organisation_group = {
      presentation_du_stand: 0,
      orginalite_de_la_decoration: 0,
      coordination_des_activites: 0,
    };
  }
}