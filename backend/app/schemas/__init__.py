from .unidad_administrativa import (
    PredioBase, PredioCreate, PredioUpdate, PredioResponse, PredioListResponse,
    TramiteCatastralCreate, TramiteCatastralUpdate, TramiteCatastralResponse,
)
from .unidad_espacial import (
    TerrenoCreate, TerrenoUpdate, TerrenoResponse, TerrenoListResponse,
    UnidadConstruccionCreate, UnidadConstruccionUpdate, UnidadConstruccionResponse,
    CaracteristicasUCCreate, CaracteristicasUCUpdate, CaracteristicasUCResponse,
)
from .interesados import (
    InteresadoCreate, InteresadoUpdate, InteresadoResponse, InteresadoListResponse,
    AgrupacionInteresadosCreate, AgrupacionInteresadosUpdate, AgrupacionInteresadosResponse,
    MiembrosCreate, MiembrosUpdate, MiembrosResponse,
)
from .topografia import (
    LinderoCreate, LinderoUpdate, LinderoResponse, LinderoListResponse,
    PuntoLinderoCreate, PuntoLinderoUpdate, PuntoLinderoResponse,
    PuntoControlCreate, PuntoControlUpdate, PuntoControlResponse,
    PuntoCclCreate, PuntoCclResponse, MasCclCreate, MasCclResponse,
)
from .cartografia import (
    CartografiaBasePolygon, CartografiaBaseUpdate, CartografiaResponse, CartografiaListResponse,
    SectorCreate, SectorUpdate, SectorResponse, SectorListResponse,
    ManzanaCreate, ManzanaUpdate, ManzanaResponse,
    NomenclaturaVialCreate, NomenclaturaVialUpdate, NomenclaturaVialResponse,
)
