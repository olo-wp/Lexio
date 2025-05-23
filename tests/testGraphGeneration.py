from graphVisualization.visualizeGraph import visualize_graph
from functionCalling.getResponse import get_response
from pprint import pprint
import json

text = '''Lotte war lange meine beste Freundin. Doch leider ist unsere Freundschaft zerbrochen, weil sie so eifersüchtig auf mich war. Sie war mit Paul zusammen, während ich zu der Zeit keinen Freund hatte. Deshalb haben wir uns manchmal zu dritt getroffen.
Nach jedem Treffen bombardierte mich Lotte mit Fragen wie:
„Glaubst du, er findet dich intelligenter als mich?“
oder
„Wer ist seiner Meinung nach attraktiver – ich oder du?“
Diese ständige Unsicherheit und Eifersucht belastete uns beide. Irgendwann wurde es zu viel, und ich entschied mich, die Freundschaft zu beenden.
— Vica
'''

'''response = get_response(text=text)

arguments_dict = json.loads(response.output[0].arguments)
'''
arguments_dict = {'edges': [{'arrow_type': 'plus',
            'label': 'Freundschaft',
            'source': 'n1',
            'target': 'n2',
            'translation': 'Friendship'},
           {'arrow_type': 'dashed',
            'label': 'beendet',
            'source': 'n2',
            'target': 'n2',
            'translation': 'ended'},
           {'arrow_type': 'normal',
            'label': 'zusammen',
            'source': 'n1',
            'target': 'n3',
            'translation': 'together'},
           {'arrow_type': 'normal',
            'label': 'Belastung',
            'source': 'n4',
            'target': 'n5',
            'translation': 'burden'},
           {'arrow_type': 'normal',
            'label': 'Nach Treffen',
            'source': 'n3',
            'target': 'n4',
            'translation': 'After meetings'}],
 'nodes': [{'crossed': False,
            'display_type': 'both',
            'id': 'n1',
            'image_description': 'Female figure with friendship symbols',
            'main_label': 'Lotte',
            'subpoints': [{'crossed': False,
                           'text': 'beste Freundin',
                           'translation': 'best friend'}],
            'translation': 'Lotte'},
           {'crossed': False,
            'display_type': 'both',
            'id': 'n2',
            'image_description': 'Female figure ending a friendship',
            'main_label': 'Vica',
            'subpoints': [{'crossed': False,
                           'text': 'eifersüchtig auf mich',
                           'translation': 'jealous of me'},
                          {'crossed': True,
                           'text': 'beendete Freundschaft',
                           'translation': 'ended friendship'}],
            'translation': 'Vica'},
           {'crossed': False,
            'display_type': 'both',
            'id': 'n3',
            'image_description': 'Male figure involved in a relationship',
            'main_label': 'Paul',
            'subpoints': [{'crossed': False,
                           'text': 'Freund von Lotte',
                           'translation': 'boyfriend of Lotte'}],
            'translation': 'Paul'},
           {'crossed': False,
            'display_type': 'both',
            'id': 'n4',
            'image_description': 'Cluster of questioning symbols',
            'main_label': 'Fragen nach Treffen',
            'subpoints': [{'crossed': False,
                           'text': 'intelligenter?',
                           'translation': 'smarter?'},
                          {'crossed': False,
                           'text': 'attraktiver?',
                           'translation': 'more attractive?'}],
            'translation': 'Questions after meetings'},
           {'crossed': True,
            'display_type': 'both',
            'id': 'n5',
            'image_description': 'Broken chain with jealousy symbols',
            'main_label': 'Eifersucht',
            'subpoints': [{'crossed': False,
                           'text': 'ständige Unsicherheit',
                           'translation': 'constant insecurity'}],
            'translation': 'Jealousy'}],
 'topic': {'description': 'Was macht jede Freundschaft kaputt?',
           'translation': 'What Destroys Friendships?'}}


#pprint(arguments_dict)
visualize_graph(arguments_dict)
