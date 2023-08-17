export interface Nodes extends d3.SimulationNodeDatum {
    age?: number
    documented_name?: string
    gender?: number
    id: number
    node_class: string
    uuid: string
    relation_type__name?: string
    voyage?: number
    voyage_dates__imp_arrival_at_port_of_dis_sparsedate__year?: number
    voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__name?: string
    voyage_itinerary__imp_principal_port_slave_dis__geo_location__name?: string
    voyage_ship__ship_name?: string
    alias?: string
    identity?: number
}

export interface Edges extends d3.SimulationLinkDatum<Nodes> {
    data?: RoleName
    source: string
    target: string
}

export interface RoleName {
    role__name?: string
}
export type Datas = {
    nodes: Nodes[];
    edges: Edges[];
};

export interface InitialStatePastNetworksData {
    data: Datas
}
